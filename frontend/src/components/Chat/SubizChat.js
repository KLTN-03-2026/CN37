import { useEffect } from "react";

function SubizChat() {
  useEffect(() => {
    if (window.subiz) return;

    (function (s, u, b, i, z) {
      if (!s[i]) {
        s._sbzaccid = z;

        s[i] = function () {
          s[i].q.push(arguments);
        };

        s[i].q = [];
        s[i]("setAccount", z);

        const domains = [
          "widget.subiz.net",
          "storage.googleapis.com",
          "app.sbz.workers.dev",
        ];

        const loadScript = (k) => {
          if (!domains[k]) return;

          const script = u.createElement(b);
          const firstScript = u.getElementsByTagName(b)[0];

          script.async = true;
          script.src = `https://${domains[k]}/sbz/app.js?accid=${z}`;

          firstScript.parentNode.insertBefore(script, firstScript);

          setTimeout(() => loadScript(k + 1), 2000);
        };

        loadScript(0);
      }
    })(window, document, "script", "subiz", "acsqkefrjrydflxyexpb");
  }, []);

  return null;
}

export default SubizChat;