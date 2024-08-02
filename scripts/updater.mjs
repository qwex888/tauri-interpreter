import fetch from 'node-fetch';
import { getOctokit, context } from '@actions/github';
import { resolveChangeLog } from './updatelog.mjs';

const UPDATE_TAG_NAME = 'updater';
const UPDATE_JSON_FILE = 'update.json';
const UPDATE_JSON_PROXY = "update-proxy.json";

/// 生成 update.json 文件并更新 github updater release 中的文件
async function resolveUpdater() {
  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error('GITHUB_TOKEN is required');
  }

  const options = { owner: context.repo.owner, repo: context.repo.repo };
  const github = getOctokit(process.env.GITHUB_TOKEN);

  const { data: tags } = await github.rest.repos.listTags({
    ...options,
    per_page: 10,
    page: 1
  });

  const tag = tags.find(t => t.name.startsWith('v'));

  console.log('tag: ', tag);

  const { data: latestRelease } = await github.rest.repos.getReleaseByTag({
    ...options,
    tag: tag.name
  });
  // 获取日志更新内容
  const notes = await resolveChangeLog(tag.name)
  // 更新发布tag release 内容
  github.rest.repos.updateRelease({
    ...options,
    release_id: latestRelease.id,
    body: notes
  });

  // 根据需要选择需更新的平台，应与编译脚本平台选择对应
  const updateData = {
    version: tag.name,
    notes,
    pub_date: new Date().toISOString(),
    platforms: {
      win64: { signature: "", url: "" }, // compatible with older formats
      linux: { signature: "", url: "" }, // compatible with older formats
      darwin: { signature: "", url: "" }, // compatible with older formats
      // comment out as needed
      'darwin-aarch64': { signature: '', url: '' },
      'darwin-intel': { signature: '', url: '' },
      'darwin-x86_64': { signature: '', url: '' },
      'linux-x86_64': { signature: '', url: '' },
      'windows-x86_64': { signature: '', url: '' },
      // 'windows-i686': { signature: '', url: '' } // no supported
    }
  };

  const promises = latestRelease.assets.map(async asset => {
    const { name, browser_download_url } = asset;
    // win64 url
    if (name.endsWith('.msi.zip') && name.includes('en-US')) {
      updateData.platforms.win64.url = browser_download_url;
      updateData.platforms['windows-x86_64'].url = browser_download_url;
    }
    // win64 signature
    if (name.endsWith('.msi.zip.sig') && name.includes('en-US')) {
      const sig = await getSignature(browser_download_url);
      updateData.platforms.win64.signature = sig;
      updateData.platforms['windows-x86_64'].signature = sig;
    }

    // darwin url (intel)
    if (name.endsWith('.app.tar.gz') && !name.includes('aarch')) {
      updateData.platforms.darwin.url = browser_download_url;
      updateData.platforms['darwin-intel'].url = browser_download_url;
      updateData.platforms['darwin-x86_64'].url = browser_download_url;
    }
    // darwin signature (intel)
    if (name.endsWith('.app.tar.gz.sig') && !name.includes('aarch')) {
      const sig = await getSignature(browser_download_url);
      updateData.platforms.darwin.signature = sig;
      updateData.platforms['darwin-intel'].signature = sig;
      updateData.platforms['darwin-x86_64'].signature = sig;
    }

    // darwin url (aarch)
    if (name.endsWith('aarch64.app.tar.gz')) {
      updateData.platforms['darwin-aarch64'].url = browser_download_url;
    }
    // darwin signature (aarch)
    if (name.endsWith('aarch64.app.tar.gz.sig')) {
      const sig = await getSignature(browser_download_url);
      updateData.platforms['darwin-aarch64'].signature = sig;
    }

    // linux url
    if (name.endsWith('.AppImage.tar.gz')) {
      updateData.platforms.linux.url = browser_download_url;
      updateData.platforms['linux-x86_64'].url = browser_download_url;
    }
    // linux signature
    if (name.endsWith('.AppImage.tar.gz.sig')) {
      const sig = await getSignature(browser_download_url);
      updateData.platforms.linux.signature = sig;
      updateData.platforms['linux-x86_64'].signature = sig;
    }
  });

  await Promise.allSettled(promises);
  console.log(updateData);

  Object.entries(updateData.platforms).forEach(([key, value]) => {
    if (!value.url) {
      console.log(`[Error]: failed to parse release for "${key}"`);
      delete updateData.platforms[key];
    }
  });
  // 生成一个代理github的更新文件
  const updateDataNew = JSON.parse(JSON.stringify(updateData));

  Object.entries(updateDataNew.platforms).forEach(([key, value]) => {
    if (value.url) {
      updateDataNew.platforms[key].url = "https://github.yocat.eu.org/" + value.url;
    } else {
      console.log(`[Error]: updateDataNew.platforms.${key} is null`);
    }
  });

  // 更新 update.json 文件
  const { data: updateRelease } = await github.rest.repos.getReleaseByTag({
    ...options,
    tag: UPDATE_TAG_NAME
  });

  for (let asset of updateRelease.assets) {
    if (asset.name === UPDATE_JSON_FILE) {
      await github.rest.repos.deleteReleaseAsset({
        ...options,
        asset_id: asset.id
      });
    }
    if (asset.name === UPDATE_JSON_PROXY) {
      await github.rest.repos
        .deleteReleaseAsset({ ...options, asset_id: asset.id })
        .catch(console.error); // do not break the pipeline
    }
  }

  await github.rest.repos.uploadReleaseAsset({
    ...options,
    release_id: updateRelease.id,
    name: UPDATE_JSON_FILE,
    data: JSON.stringify(updateData, null, 2)
  });
  await github.rest.repos.uploadReleaseAsset({
    ...options,
    release_id: updateRelease.id,
    name: UPDATE_JSON_PROXY,
    data: JSON.stringify(updateDataNew, null, 2),
  });
}



async function getSignature(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/octet-stream' }
  });

  return response.text();
}

resolveUpdater().catch(console.error);
