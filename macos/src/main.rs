use tao::{
    dpi::LogicalSize,
    event::{Event, WindowEvent},
    event_loop::{ControlFlow, EventLoop},
    window::WindowBuilder,
};
use wry::WebViewBuilder;

const URL: &str = "https://www.camel1.tv/";

const SITE_HOSTS: &[&str] = &["camel1.tv", "camel1.to", "camel1.link", "cameltv.live", "camel4.live"];
const SOCIAL_HOSTS: &[&str] = &["t.me", "instagram.com", "youtube.com", "tiktok.com", "facebook.com"];

fn host_matches(url: &str, list: &[&str]) -> bool {
    let host = url.split("://").nth(1).unwrap_or("").split(['/', '?', ':']).next().unwrap_or("");
    list.iter().any(|h| host == *h || host.ends_with(&format!(".{h}")))
}
fn is_site(url: &str) -> bool { host_matches(url, SITE_HOSTS) }
fn is_social(url: &str) -> bool { host_matches(url, SOCIAL_HOSTS) }

fn main() -> wry::Result<()> {
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title("Ninety")
        .with_inner_size(LogicalSize::new(1280.0, 800.0))
        .build(&event_loop)
        .expect("failed to create window");

    let _webview = WebViewBuilder::new()
        .with_url(URL)
        .with_back_forward_navigation_gestures(true)
        .with_initialization_script(concat!(include_str!("theme.js"), "\n", include_str!("adblock.js")))
        .with_new_window_req_handler(|url| {
            // Pop-ups are dropped unless they go to the site's own social links.
            if is_social(&url) {
                let _ = std::process::Command::new("open").arg(&url).spawn();
            }
            false
        })
        // Only the site itself loads in the window. Social links go to the browser;
        // anything else (ad redirects such as refpa2518.com -> 1xbet.ng) is refused.
        .with_navigation_handler(|url| {
            if is_site(&url) || url.starts_with("about:") || url.starts_with("blob:") {
                return true;
            }
            if is_social(&url) {
                let _ = std::process::Command::new("open").arg(&url).spawn();
            }
            false
        })
        .build(&window)?;

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;
        if let Event::WindowEvent { event: WindowEvent::CloseRequested, .. } = event {
            *control_flow = ControlFlow::Exit;
        }
    });
}
