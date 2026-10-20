"""목업 원본 HTML에 쓰인 글자만 남겨 글꼴을 줄이고 data URI로 넣는다."""
import base64, io, sys, re
from fontTools import subset
from fontTools.ttLib import TTFont

src_path, out_path, maru_dir, pret_dir = sys.argv[1:5]
html = open(src_path, encoding="utf-8").read()
text = re.sub(r"<style>.*?</style>", "", html, flags=re.S)
chars = set(text) | set(" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~·‹›…")
unicodes = sorted(ord(c) for c in chars if ord(c) >= 32)

faces = [
    ("MaruBuri", 400, f"{maru_dir}/MaruBuri-Regular.woff2"),
    ("MaruBuri", 700, f"{maru_dir}/MaruBuri-Bold.woff2"),
    ("Pretendard", 400, f"{pret_dir}/Pretendard-Regular.woff2"),
    ("Pretendard", 600, f"{pret_dir}/Pretendard-SemiBold.woff2"),
    ("Pretendard", 700, f"{pret_dir}/Pretendard-Bold.woff2"),
]
css = []
for family, weight, path in faces:
    font = TTFont(path)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=unicodes)
    sub.subset(font)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    data = base64.b64encode(buf.getvalue()).decode()
    print(f"{family} {weight}: {len(buf.getvalue())//1024} KB")
    css.append(f'@font-face{{font-family:"{family}";font-weight:{weight};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,{data}) format("woff2");}}')

out = html.replace("/*@FONTS@*/", "\n".join(css))
open(out_path, "w", encoding="utf-8").write(out)
print("chars:", len(unicodes), "out:", len(out)//1024, "KB")
