use tauri::{WebviewUrl, WebviewWindowBuilder};

const URL: &str = "https://www.camel1.tv/";
const AD_HOSTS: &[&str] = &["bwredir.com", "rapidadexchange.com"];

fn is_ad(url: &str) -> bool {
    let host = url.split("://").nth(1).unwrap_or("").split(['/', '?', ':']).next().unwrap_or("");
    AD_HOSTS.iter().any(|h| host == *h || host.ends_with(&format!(".{h}")))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            WebviewWindowBuilder::new(app, "main", WebviewUrl::External(URL.parse().unwrap()))
                .title("Camel1 TV")
                .inner_size(1280.0, 800.0)
                .initialization_script(include_str!("adblock.js"))
                .on_navigation(|url| !is_ad(url.as_str()))
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Camel1 TV");
}
