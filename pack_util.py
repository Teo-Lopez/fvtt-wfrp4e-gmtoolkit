import os
import subprocess
import sys;

action = sys.argv[1]
pack = ""
if (len(sys.argv) == 3):
    pack = sys.argv[2]
    

full_path = os.path.realpath(__file__)
path, filename = os.path.split(full_path)
fvtt_cmd = os.path.join(path, "node_modules", ".bin", "fvtt.cmd" if os.name == "nt" else "fvtt")
if not os.path.exists(fvtt_cmd):
    fvtt_cmd = "npx"

def run_fvtt(args):
    if fvtt_cmd == "npx":
        subprocess.run(["npx", "@foundryvtt/foundryvtt-cli", *args], shell=os.name == "nt", check=True)
    else:
        subprocess.run([fvtt_cmd, *args], shell=os.name == "nt", check=True)

if (action == "unpack"):
    for folder in os.listdir('packs'):
        if (folder != "_source" and (not pack or (pack and pack == folder))):
           run_fvtt(["package", "--in", "./packs", "--out", os.path.join("./src/packs",  folder) , "-n", folder, "--type", "Module", "unpack", folder])

if (action == "pack"):
    for folder in os.listdir('src/packs'):
        if (not pack or (pack and pack == folder)):
            run_fvtt(["package", "--in", os.path.join("./src/packs",  folder), "--out", "./packs/", "-n", folder, "--type", "Module", "pack", folder])