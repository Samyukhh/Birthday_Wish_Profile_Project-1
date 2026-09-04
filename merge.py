import os

with open('script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

with open('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\d43e2d5d-7311-42c0-91c2-cbf0b4187ef5\\scratch\\loader.js', 'r', encoding='utf-8') as f:
    loader_content = f.read()

with open('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\d43e2d5d-7311-42c0-91c2-cbf0b4187ef5\\scratch\\lazy_videos.js', 'r', encoding='utf-8') as f:
    video_content = f.read()

# Replace heroTl
script_content = script_content.replace('const heroTl = gsap.timeline();', 'const heroTl = gsap.timeline({ paused: true });')

final_content = loader_content + '\n' + script_content + '\n' + video_content

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(final_content)
