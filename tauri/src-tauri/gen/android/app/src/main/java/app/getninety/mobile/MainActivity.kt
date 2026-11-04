package app.getninety.mobile

import android.content.pm.ActivityInfo
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.os.Message
import android.view.View
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.GeolocationPermissions
import android.webkit.JsPromptResult
import android.webkit.JsResult
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.widget.FrameLayout
import androidx.activity.OnBackPressedCallback
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : TauriActivity() {
  private var fullscreenView: View? = null
  private var fullscreenCallback: WebChromeClient.CustomViewCallback? = null
  private lateinit var web: WebView

  // Back leaves full screen first; only then does it go back in history.
  private val leaveFullscreen = object : OnBackPressedCallback(false) {
    override fun handleOnBackPressed() {
      web.evaluateJavascript("document.exitFullscreen && document.exitFullscreen()", null)
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // Keep the page clear of the status bar, navigation bar and keyboard.
    val content = findViewById<ViewGroup>(android.R.id.content)
    ViewCompat.setOnApplyWindowInsetsListener(content) { v: View, insets: WindowInsetsCompat ->
      val bars = insets.getInsets(
        WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.ime()
      )
      v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
      WindowInsetsCompat.CONSUMED
    }
    ViewCompat.requestApplyInsets(content)
    onBackPressedDispatcher.addCallback(this, leaveFullscreen)
  }

  override fun onWebViewCreate(webView: WebView) {
    super.onWebViewCreate(webView)
    web = webView
    // The chrome client is installed right after this call, so wrap it one tick later.
    webView.post {
      val inner = webView.webChromeClient ?: return@post
      webView.webChromeClient = FullscreenChromeClient(inner)
    }
  }

  private fun showFullscreen(view: View, callback: WebChromeClient.CustomViewCallback) {
    if (fullscreenView != null) { callback.onCustomViewHidden(); return }
    fullscreenView = view
    fullscreenCallback = callback
    val decor = window.decorView as FrameLayout
    decor.addView(view, FrameLayout.LayoutParams(
      FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
    WindowCompat.setDecorFitsSystemWindows(window, false)
    WindowInsetsControllerCompat(window, decor).apply {
      systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
      hide(WindowInsetsCompat.Type.systemBars())
    }
    requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
    leaveFullscreen.isEnabled = true
  }

  private fun hideFullscreen() {
    val view = fullscreenView ?: return
    val decor = window.decorView as FrameLayout
    decor.removeView(view)
    fullscreenView = null
    WindowInsetsControllerCompat(window, decor).show(WindowInsetsCompat.Type.systemBars())
    WindowCompat.setDecorFitsSystemWindows(window, true)
    requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
    leaveFullscreen.isEnabled = false
    fullscreenCallback?.onCustomViewHidden()
    fullscreenCallback = null
  }

  // Everything but full screen is handed to wry's own client.
  private inner class FullscreenChromeClient(private val inner: WebChromeClient) : WebChromeClient() {
    override fun onShowCustomView(view: View, callback: CustomViewCallback) = showFullscreen(view, callback)
    override fun onHideCustomView() = hideFullscreen()

    override fun onPermissionRequest(request: PermissionRequest) = inner.onPermissionRequest(request)
    override fun getDefaultVideoPoster(): Bitmap? = inner.defaultVideoPoster
    override fun onJsAlert(view: WebView, url: String, message: String, result: JsResult) =
      inner.onJsAlert(view, url, message, result)
    override fun onJsConfirm(view: WebView, url: String, message: String, result: JsResult) =
      inner.onJsConfirm(view, url, message, result)
    override fun onJsPrompt(view: WebView, url: String, message: String, defaultValue: String, result: JsPromptResult) =
      inner.onJsPrompt(view, url, message, defaultValue, result)
    override fun onGeolocationPermissionsShowPrompt(origin: String, callback: GeolocationPermissions.Callback) =
      inner.onGeolocationPermissionsShowPrompt(origin, callback)
    override fun onShowFileChooser(webView: WebView, filePathCallback: ValueCallback<Array<Uri>>, fileChooserParams: FileChooserParams) =
      inner.onShowFileChooser(webView, filePathCallback, fileChooserParams)
    override fun onConsoleMessage(consoleMessage: ConsoleMessage) = inner.onConsoleMessage(consoleMessage)
    override fun onReceivedTitle(view: WebView, title: String) = inner.onReceivedTitle(view, title)
    override fun onProgressChanged(view: WebView, newProgress: Int) = inner.onProgressChanged(view, newProgress)
    override fun onCreateWindow(view: WebView, isDialog: Boolean, isUserGesture: Boolean, resultMsg: Message) =
      inner.onCreateWindow(view, isDialog, isUserGesture, resultMsg)
    override fun onCloseWindow(window: WebView) = inner.onCloseWindow(window)
  }
}
