
# NEXT UPDATE [0.0.3] ---------> !!!

import gi
gi.require_version("Gtk", "3.0")
from gi.repository import Gtk, GdkPixbuf

def show_about(button):
    # إنشاء النافذة
    about = Gtk.AboutDialog()
    
    # تحديد المعلومات
    about.set_program_name("Fluct Extension")
    about.set_version("0.0.3")
    about.set_authors(["Mohamed (fluct1)"])
    about.set_copyright("Copyright © 2026")
    about.set_comments("A professional GTK completion provider for VS Code.")
    about.set_website("https://github.com/CatMilkTea-M/ac-gtk-python")
    
    # NEXT UPDATE [0.0.4] ---------> !!!
    # إضافة اللوجو (إذا كان لديك ملف صورة)
    # pixbuf = GdkPixbuf.Pixbuf.new_from_file("logo.png")
    # about.set_logo(pixbuf)
    #------------------------------------------ !
    # تشغيل النافذة وإغلاقها عند الضغط على Close
    about.run()
    about.destroy()

# كود تشغيل بسيط
win = Gtk.Window(title="hi")
btn = Gtk.Button(label="about")
btn.connect("clicked", show_about)
win.add(btn)
win.connect("destroy", Gtk.main_quit)
win.show_all()
Gtk.main()