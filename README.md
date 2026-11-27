# Interactive-3D-vizualise-learning

Открытая архитектура интерактивных учебных симуляторов аналитического оборудования.

- [Платформа 0.2.0 (автономный HTML)](index.html) — скачать один файл и открыть в браузере. Каталог, поиск, фильтры и три встроенных симулятора.
- [УФ/Вид-спектрофотометр 0.1.0](releases/uvvis-0.1.0/index.html).
- [Научный Runtime и паспорт модели УФ/Вид](docs/platform/runtime-uvvis.md).
- [Архитектура оболочки и тесты](docs/platform/platform-shell.md).
- [ГХ 0.0.2 — динамический учебный прототип](releases/mwp-0.0.2/index.html).
- [ВЭЖХ 2.0 — импортированный учебный прототип](prototypes/liquid-chromatography/hplc-2.0/index.html).
- [ГХ 0.0.1 — исходная TypeScript-реализация](releases/mwp-0.0.1/index.html).
- [Архитектура библиотеки приборов](docs/platform/instrument-library.md).
- [Утверждённая спецификация ГХ: 122 ADR](docs/baselines/gc-alpha-v1/README.md).
- [Фундамент MWP](docs/mwp/README.md).
- [Инструкции для Codex](AGENTS.md).

Три учебных прототипа подключены через общий реестр и адаптер HTML. Новый Runtime используется в УФ/Вид и проверен с изотермическим решателем ГХ 0.0.1. Динамический ГХ и ВЭЖХ остаются независимыми; экспериментальная валидация отсутствует.

Сборка: `npm run build:platform`. Проверка: `npm ci && npm test` (Node 22.16.0, TypeScript 5.8.3 на PATH). Браузер: `python tests/platform-browser.py`.
