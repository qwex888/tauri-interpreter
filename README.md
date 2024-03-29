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

## 启动

### 启动纯 web 项目

```bash
yarn dev
```

### 启动纯 tauri 项目

第一次启动项目时，tauri 会根据src-tauri/Cargo.toml 去下载相关依赖（导致第一次启动比较慢），第二次启动会快很多。

```bash
yarn tauri dev
```

### 构建应用

默认构建命令：

```bash
yarn tauri build
```

但是如果未修改 `src-tauri/tauri.conf.json` 中的 `identifier` 直接 build 会报以下错误。想要正确构建，只需修改为自己特有的标识符即可，如 `com.myapp.dev`。构建完成后，在 `src-tauri/target/release/bundle/{platform}/{app}` 下就可以找到应用程序安装包。

## 生成图标

```bash
yarn tauri icon
```

