use tao::{
    dpi::LogicalSize,
    event::{Event, WindowEvent},
    event_loop::{ControlFlow, EventLoop},
    window::WindowBuilder,
};
use wry::WebViewBuilder;

const URL: &str = "https://www.camel1.tv/";

const AD_HOSTS: &[&str] = &["bwredir.com", "rapidadexchange.com"];
const SOCIAL_HOSTS: &[&str] = &["t.me", "instagram.com", "youtube.com", "tiktok.com", "facebook.com"];

fn host_matches(url: &str, list: &[&str]) -> bool {
    let host = url.split("://").nth(1).unwrap_or("").split(['/', '?', ':']).next().unwrap_or("");
    list.iter().any(|h| host == *h || host.ends_with(&format!(".{h}")))
}
fn is_ad(url: &str) -> bool { host_matches(url, AD_HOSTS) }
fn is_social(url: &str) -> bool { host_matches(url, SOCIAL_HOSTS) }

fn main() -> wry::Result<()> {
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title("Camel1 TV")
        .with_inner_size(LogicalSize::new(1280.0, 800.0))
        .build(&event_loop)
        .expect("failed to create window");

    let _webview = WebViewBuilder::new()
        .with_url(URL)
        .with_initialization_script(include_str!("adblock.js"))
        .with_new_window_req_handler(|url| {
            // Pop-ups are dropped unless they go to the site's own social links.
            if is_social(&url) {
                let _ = std::process::Command::new("open").arg(&url).spawn();
            }
            false
        })
        .with_navigation_handler(|url| !is_ad(&url))
        .build(&window)?;

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;
        if let Event::WindowEvent { event: WindowEvent::CloseRequested, .. } = event {
            *control_flow = ControlFlow::Exit;
        }
    });
}
