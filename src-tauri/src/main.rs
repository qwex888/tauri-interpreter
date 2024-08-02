#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Window, Wry, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, CustomMenuItem, AppHandle};
// #[warn(unused_attributes)]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn shortcut(window: Window) -> String {
    let window = window.get_window("main").unwrap();
    // if window.is_visible().unwrap() {
      // window.hide().unwrap();
      // "hide".into()
    // }
    //  else {
      window.show().unwrap();
      window.set_focus().unwrap();
      "show".into()
    // }
}
// 创建系统托盘
pub fn create_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit Program"); // 创建 quit 选项，quit 为对应项目 id，Quit Program 为实际显示文本
    let hide = CustomMenuItem::new("hide".to_string(), "Close to tray");// 创建 hide 选项，hide 为对应项目 id，Close to tray 为实际显示文本
    let tray_menu = SystemTrayMenu::new()
      .add_item(hide)
      .add_native_item(SystemTrayMenuItem::Separator) // 添加项目间分隔线
      .add_item(quit);
    SystemTray::new().with_menu(tray_menu)
}

// 处理托盘事件
pub fn handle_system_tray_event(app: &AppHandle<Wry>, event: SystemTrayEvent) {
    match event {
        // 匹配项目双击事件
        SystemTrayEvent::DoubleClick { position: _ , size: _, .. } => {
            let window = app.get_window("main").unwrap();
            window.unminimize().unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        },
        // 匹配项目单击事件，根据 id 区分不同行为
        SystemTrayEvent::MenuItemClick { id, ..} => {
            match id.as_str() {
              "quit" => {
                app.get_window("main").unwrap().hide().unwrap();
                app.emit_all("close", {}).unwrap();
                println!("System tray try to close");
              }
              "hide" => {
                app.get_window("main").unwrap().hide().unwrap();
                app.emit_all("hide", {}).unwrap();
                println!("System tray try to hide/show");
              }
              _ => {}
            }
        }
        _ => {}
    }
}

// 通过 command 国际化托盘文本
// #[command]
pub fn change_system_tray_lang(lang: &str, app_handle: tauri::AppHandle) -> bool {
  let window = app_handle.get_window("main").unwrap();

  let hide_item = app_handle.tray_handle().get_item("hide");
  let quit_item = app_handle.tray_handle().get_item("quit");

  if &lang == &"zh-CN" {
    let hide_title = if window.is_visible().unwrap() {"显示主界面"} else {"最小化至托盘"};
    let quit_title = r"退出程序";

    hide_item.set_title(format!("{}", hide_title)).unwrap();
    quit_item.set_title(format!("{}", quit_title)).unwrap();
  } else if &lang == &"en-US" {
    let hide_title = if window.is_visible().unwrap() {"Show MainPage"} else {"Close to tray"};
    let quit_title = r"Quit Program";

    hide_item.set_title(format!("{}", hide_title)).unwrap();
    quit_item.set_title(format!("{}", quit_title)).unwrap();
  }

  println!("Change sysyem tray to lang {}", lang);
  true
}
fn main() {
    tauri::Builder::default()
        .system_tray(create_system_tray())
    	.on_system_tray_event(handle_system_tray_event)
        .invoke_handler(tauri::generate_handler![shortcut])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
