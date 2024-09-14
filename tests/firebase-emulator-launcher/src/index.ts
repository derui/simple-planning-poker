import http from "node:http";

const interval = 100;

const check = function check(retries: number) {
  if (retries >= 100) {
    console.warn("Emulator does not launch long time");
    process.exit(1);
  }

  const req = http
    .request(
      {
        host: "127.0.0.1",
        port: 4000,
        path: "/",
        timeout: interval,
      },
      () => {
        console.log("Launched");
        process.exit(0);
      }
    )
    .on("error", () => {
      req.destroy();
      setTimeout(() => check(retries + 1), interval);
    });

  req.end();
};

check(0);
