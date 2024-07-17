import { context, getOctokit } from '@actions/github';
import { readFile, readdir } from 'node:fs/promises';

const octokit = getOctokit(process.env.GITHUB_TOKEN);

const tagName = 'updater';
const updateRelease = async () => {
  let release = null;
  // console.log('------>actions:context: ', context);
  try {
    // 获取updater tag的release
    const { data } = await octokit.rest.repos.getReleaseByTag({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag: tagName
    });
    release = data
    // 删除旧的的文件
    const deletePromises = release.assets
      .filter(item => item.name === 'latest.json')
      .map(async item => {
        await octokit.rest.repos.deleteReleaseAsset({
          owner: context.repo.owner,
          repo: context.repo.repo,
          asset_id: item.id
        });
      });

    await Promise.all(deletePromises);
  } catch (error) {
    if (error.status === 404 || error.message === 'release not found') {
      const createdRelease = await octokit.rest.repos.createRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_name: tagName,
        name: 'Tauri Interpreter',
        body: '',
        draft: true,
        prerelease: false,
        target_commitish: context.sha
      });
      release = createdRelease.data;
    }
  }
  console.log('------>release: ', release);
  const files = await readdir('./', { withFileTypes: true });
  const roots = await readdir('../', { withFileTypes: true });
  console.log('------>:read:files', files);
  console.log('------>:read:roots', roots);
  // 上传新的文件
  const file = await readFile('latest.json', { encoding: 'utf-8' });
  const data = JSON.parse(file);
  if (data.platforms['darwin-x86_64']) {
    data.platforms['darwin-aarch64'] = data.platforms['darwin-x86_64'];
  }

  await octokit.rest.repos.uploadReleaseAsset({
    owner: context.repo.owner,
    repo: context.repo.repo,
    release_id: release.id,
    name: 'latest.json',
    data: JSON.stringify(data, null, 2)
  });
};

updateRelease();
