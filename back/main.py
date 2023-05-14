import eel


if __name__ == "__main__":
    eel.init("dist", allowed_extensions=[".js", ".html"])

    eel.start("index.html", mode="chrome", size=(200, 200))
