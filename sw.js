self.addEventListener("push", event => {
  let data = { title: "Exam HQ", body: "Your revision reminder is ready.", url: "/exam-hq/" };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch (_) {}
  event.waitUntil(self.registration.showNotification(data.title || "Exam HQ", {
    body: data.body || "Your revision reminder is ready.",
    data: { url: data.url || "/exam-hq/" },
    tag: data.tag || "examhq-" + Date.now(),
    renotify: false
  }));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/exam-hq/", self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientsList) { if (client.url.startsWith(self.location.origin + "/exam-hq/")) { await client.focus(); return; } }
    await self.clients.openWindow(target);
  })());
});
self.addEventListener("install", event => { self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(self.clients.claim()); });
