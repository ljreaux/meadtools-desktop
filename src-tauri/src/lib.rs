// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};

pub fn run() {
    let sql = "
  CREATE TABLE ingredients (
      id SERIAL PRIMARY KEY,
      name varchar(255) NOT NULL,
      sugar_content numeric NOT NULL,
      water_content numeric NOT NULL,
      category varchar(255) NOT NULL
    );

    CREATE TABLE yeasts (
      id SERIAL PRIMARY KEY,
      brand varchar(255) NOT NULL,
      name varchar(255) NOT NULL,
      nitrogen_requirement varchar(255) NOT NULL,
      tolerance numeric NOT NULL,
      low_temp numeric NOT NULL,
      high_temp numeric NOT NULL
    );";
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql,
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:meadtools.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
