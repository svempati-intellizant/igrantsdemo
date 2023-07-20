import os

from gunicorn.app.base import Application, Config

from app import app


class GUnicornFlaskApplication(Application):
    def __init__(self, app):
        self.usage, self.callable, self.prog, self.app = None, None, None, app

    def run(self, **options):
        self.cfg = Config()
        [self.cfg.set(key, value) for key, value in options.items()]
        return Application.run(self)

    load = lambda self: self.app


if __name__ == "__main__":
    gunicorn_app = GUnicornFlaskApplication(app)
    gunicorn_app.run(
        worker_class="gunicorn.workers.sync.SyncWorker",
        bind=f"0.0.0.0:{os.getenv('PORT')}",
        workers=4,
        timeout=os.getenv("GUNICORN_TIMEOUT", 600),
    )
