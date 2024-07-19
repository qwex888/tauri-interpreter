# interpreter

## 前置条件

tauri 依赖 rust，需要先安装 rust 环境。

[https://www.rust-lang.org/zh-CN/tools/install](https://www.rust-lang.org/zh-CN/tools/install)

Rust 的编译工具依赖 C 语言的编译工具，这意味着你的电脑上至少已经存在一个 C 语言的编译环境。如果你使用的是 Linux 系统，往往已经具备了 GCC 或 clang。如果你使用的是 macOS，需要安装 Xcode。如果你是用的是 Windows 操作系统，你需要安装 Visual Studio 2013 或以上的环境（需要 C/C++ 支持）以使用 MSVC 或安装 MinGW + GCC 编译环境（Cygwin 还没有测试）。

所有选项选择默认。

安装完成后通过命令测试是否安装完成。

```bash
rustc -V        # 注意的大写的 V
# 和
cargo -V
```

使用vscode开发的话 安装 `tauri`、`rust` 和 `Native Debug` 插件。

## 变量

根目录创建`.env`文件

### gemini

```env
# google-gemini
VITE_GEMINI_API_KEY = 'xxx'
```

### baidu

```env
# baidu
VITE_BAIDU_APPID = 'xxx'
VITE_BAIDU_SECRET = 'xxxx'
```

### openAi

```env
# openai
VITE_OPENAI_API_KEY = 'xxx'
```

## 启动

### 启动纯 web 项目

```bash
pnpm dev
```

### 启动纯 tauri 项目

第一次启动项目时，tauri 会根据src-tauri/Cargo.toml 去下载相关依赖（导致第一次启动比较慢），第二次启动会快很多。

```bash
pnpm tauri dev
```

### 生产环境调试

```bash
pnpm tauri build -- --debug
```

### 构建应用

默认构建命令：

```bash
pnpm tauri build
```

但是如果未修改 `src-tauri/tauri.conf.json` 中的 `identifier` 直接 build 会报以下错误。想要正确构建，只需修改为自己特有的标识符即可，如 `com.myapp.dev`。构建完成后，在 `src-tauri/target/release/bundle/{platform}/{app}` 下就可以找到应用程序安装包。

## 生成图标

```bash
pnpm tauri icon
```

## 代码提交格式

提交格式

```bash
git commit -m <type>(scope?): <subject>
```

示例：

```bash
git commit -m 'chore: run tests on travis ci'

git commit -m 'fix(server): send cors headers'

git commit -m 'feat(blog): add comment section'
```

> 注意，英文冒号 + 空格

## 发布应用

* 版本type:
  * 修订：patch (默认)
  * 次版本： minor
  * 主版本: major

```bash
pnpm publish [版本type]
```
