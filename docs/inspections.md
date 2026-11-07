# Обхід будівель

Код: блок `INSP:BEGIN … INSP:END` в `index.html`. У застосунку: Facility → «Обхід будівель».

## Ролі
| Роль | Що може |
|---|---|
| Обхідник (будь-хто, за ким закріплено будівлю) | бачить лише свої будівлі, проходить обхід, відповідає на повернутий звіт |
| CEO Asgard (`ceo`), керівник Facility (`director`), Dev | бачать усі звіти, погоджують і повертають, ставлять задачі, формують Word-звіти |
| Керівник Facility, Dev | закріплюють будівлі за обхідниками |
| Dev | чекліст пожежного щита, сховище фото (Dev-панель) |

## Дані (db)
- `buildings_assignments/<buildingId>`: `{buildingId, userIds[] (id працівників), since, updatedBy, updatedAt}`
- `inspections/<YYYY-MM-DD>_<buildingId>_<staffId>`: `{buildingId, authorId, date, status: submitted|returned|approved, points{water,vrp,fire,terr}, generalComment, reviewerId, reviewComment, walkerReply, createdAt, submittedAt, reviewedAt, mini[], photosN, remarks, exportId, purged}`
- `inspection_photos/<inspectionId>_<lid>`: `{inspectionId, pointKey, assetId | data, thumb, takenAt, fromGallery, sizeKb, purged}`
- `inspection_exports`: `{period: week|month|custom, from, to, createdBy, createdAt, buildings[], reportsCount, photosCount, fileName, purgedAt}`

## Фото
- Камера (`capture="environment"`) або галерея (позначка «з галереї»).
- Браузер сам розвертає фото за EXIF і читає HEIC на iPhone. Далі canvas: довга сторона 1600 px, JPEG ≈ 0,7, до 300 КБ. На фото накладається водяний знак (дата, час, будівля, точка, ПІБ).
- Мініатюри: 320 px (картка звіту) і 120 px (стрічка).
- Оригінал зберігається в сховищі файлів артефакту (`assets`). Якщо сховище недоступне, у документ записується стиснена копія до 170 КБ.

## Без мережі
- Чернетка разом із фото зберігається на телефоні (IndexedDB) після кожного кроку.
- «Відправити» ставить звіт у чергу. Повтор іде при появі мережі та кожні 20 с.
- Успіх показується лише після того, як база підтвердила запис.

## Звіт Word
Бібліотека `docx@8.5.0` з jsDelivr (запасна — unpkg).

Структура: титул, зведення, відкриті зауваження, матриця покриття, по сторінці на кожен звіт (фото сіткою 2×2), підписи, «стор. X з Y».

Якщо фото разом важать понад ~36 МБ, звіт ділиться на файли по будівлях.

## Очищення оригіналів
- Доступне для місячного звіту через 14 днів після його формування, кнопкою «Звіт збережено, очистити фото».
- Мініатюри й тексти лишаються.
- Автоматично нічого не видаляється.
