#!/usr/bin/env python3
"""Генерує src/*.js з index.html — копію коду застосунку, розбиту на модулі за розділами.

Навіщо: застосунок лишається одним файлом index.html (так його публікує Claude),
а індексатори коду (Graphify тощо) не розбирають код усередині <script> в HTML.
Папка src/ — лише для читання й індексації; правки робляться в index.html,
після чого запускається:  python3 tools/split_src.py
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
TR = dict(zip('абвгґдеєжзиіїйклмнопрстуфхцчшщьюя', ['a','b','v','h','g','d','e','ie','zh','z','y','i','i','i','k','l','m','n','o','p','r','s','t','u','f','kh','ts','ch','sh','shch','','iu','ia']))

def slug(t):
    t = t.lower()
    t = ''.join(TR.get(ch, ch) for ch in t)
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-')
    return t[:40].strip('-') or 'part'

def main():
    html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    scripts = [m for m in re.finditer(r'<script>(.*?)</script>', html, re.S)]
    if not scripts:
        sys.exit('no inline <script> found')
    main_m = max(scripts, key=lambda m: len(m.group(1)))
    js = main_m.group(1)
    # застосунок обгорнутий в IIFE «(function(){ … })();» — у копії обгортку знімаємо, щоб кожен модуль був цілим JS
    i = js.find('\n(function(){\nconst ROLES')
    j = js.rfind('\n})();')
    if i >= 0 and j > i:
        js = js[:i] + '\n/* (function(){ — початок обгортки застосунку */\n' + js[i + len('\n(function(){\n'):j] + '\n/* })(); — кінець обгортки застосунку */' + js[j + len('\n})();'):]
    head = '\n'.join(m.group(1).strip() for m in scripts if m is not main_m)
    # межі модулів: «/* ---------- Назва ---------- */» і «/* NAME:BEGIN …» (блок до NAME:END не ріжемо)
    marks = []
    end_at = -1
    for m in re.finditer(r'^/\* (?:-{6,} (.+?) -{6,}|([A-Z0-9]+):BEGIN\s*[—-]?\s*([^\n*]*))', js, re.M):
        if m.start() < end_at:
            continue
        if m.group(2):
            e = js.find('/* ' + m.group(2) + ':END', m.end())
            end_at = e if e > 0 else -1
            title = m.group(3).strip() or m.group(2)
        else:
            title = m.group(1)
        marks.append((m.start(), title))
    cuts = [(0, 'core-state-helpers')] + marks
    parts = []
    for i, (pos, title) in enumerate(cuts):
        end = cuts[i + 1][0] if i + 1 < len(cuts) else len(js)
        body = js[pos:end].strip('\n')
        if body.strip():
            parts.append((title, body))
    os.makedirs(SRC, exist_ok=True)
    for f in os.listdir(SRC):
        if f.endswith('.js'):
            os.remove(os.path.join(SRC, f))
    note = '// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.\n'
    names = []
    if head:
        names.append('00-head-splash-logo.js')
        open(os.path.join(SRC, names[-1]), 'w', encoding='utf-8').write(note + '// Інлайн-скрипти з <head>/<body>: логотип, екран завантаження.\n\n' + head + '\n')
    used = set()
    for i, (title, body) in enumerate(parts, 1):
        n = '%02d-%s.js' % (i, slug(title))
        while n in used:
            n = n[:-3] + '-x.js'
        used.add(n)
        names.append(n)
        open(os.path.join(SRC, n), 'w', encoding='utf-8').write(note + '// Розділ: ' + title.strip() + '\n\n' + body + '\n')
    # точка входу: порядок завантаження модулів = порядок у index.html
    open(os.path.join(SRC, 'main.js'), 'w', encoding='utf-8').write(note + '// Порядок модулів як у index.html. Усі модулі ділять глобальну область (один <script>).\n\n' + ''.join("import './%s';\n" % n for n in names))
    print('src/: %d модулів' % len(names))

if __name__ == '__main__':
    main()
