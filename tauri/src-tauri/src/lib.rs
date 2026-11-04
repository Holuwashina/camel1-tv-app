use tauri::{WebviewUrl, WebviewWindowBuilder};

const URL: &str = "https://www.camel1.tv/";
const SITE_HOSTS: &[&str] = &["camel1.tv", "camel1.to", "camel1.link", "cameltv.live", "camel4.live"];
const SOCIAL_HOSTS: &[&str] = &["t.me", "instagram.com", "youtube.com", "tiktok.com", "facebook.com"];

fn host_matches(url: &str, list: &[&str]) -> bool {
    let host = url.split("://").nth(1).unwrap_or("").split(['/', '?', ':']).next().unwrap_or("");
    list.iter().any(|h| host == *h || host.ends_with(&format!(".{h}")))
}

// Only the site and its social links may load; ad redirects are refused.
fn allowed(url: &str) -> bool {
    url.starts_with("about:") || url.starts_with("blob:")
        || host_matches(url, SITE_HOSTS) || host_matches(url, SOCIAL_HOSTS)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            WebviewWindowBuilder::new(app, "main", WebviewUrl::External(URL.parse().unwrap()))
                .title("Ninety")
                .inner_size(1280.0, 800.0)
                .initialization_script(concat!(include_str!("theme.js"), "\n", include_str!("adblock.js")))
                .on_navigation(|url| allowed(url.as_str()))
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Ninety");
}
