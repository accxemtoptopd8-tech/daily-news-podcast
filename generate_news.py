import json
import requests
import edge_tts
import asyncio
from datetime import datetime

# Đọc config
with open('config.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

async def text_to_speech(text, filename):
    communicate = edge_tts.Communicate(text, "vi-VN-NamMinhNeural")
    await communicate.save(filename)

def fetch_news_for_topic(topic):
    """
    Gọi API LLM (ví dụ OpenAI, Gemini) để lấy tóm tắt tin tức trong ngày cho topic.
    Trả về dict: {'title': '...', 'content': '...'}
    """
    # TODO: thay bằng code thật
    # Giả lập dữ liệu mẫu
    return {
        'title': f"Tin {topic} hôm nay",
        'content': f"Nội dung tóm tắt về {topic} vào ngày {datetime.now().strftime('%d/%m/%Y')}. Đây là bản test."
    }

def main():
    all_news = []
    full_text = ""

    for topic in config['topics']:
        news = fetch_news_for_topic(topic)
        all_news.append(news)
        full_text += f"{news['title']}. {news['content']}\n\n"

    # Lưu JSON
    output_json = {
        "last_updated": datetime.now().isoformat(),
        "topics": all_news
    }
    with open('news_today.json', 'w', encoding='utf-8') as f:
        json.dump(output_json, f, ensure_ascii=False, indent=2)

    # Tạo audio
    asyncio.run(text_to_speech(full_text, 'audio.mp3'))
    print("✅ Đã tạo news_today.json và audio.mp3")

if __name__ == "__main__":
    main()
