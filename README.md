# Interactive-3D-vizualise-learning

Открытая архитектура интерактивных учебных симуляторов аналитического оборудования.

- [Платформа 0.1.0 (автономный HTML)](index.html) — скачать один файл и открыть в браузере. Каталог, поиск, фильтры и два встроенных симулятора.
- [Архитектура оболочки и тесты](docs/platform/platform-shell.md).
- [ГХ 0.0.2 — динамический учебный прототип](releases/mwp-0.0.2/index.html).
- [ВЭЖХ 2.0 — импортированный учебный прототип](prototypes/liquid-chromatography/hplc-2.0/index.html).
- [ГХ 0.0.1 — исходная TypeScript-реализация](releases/mwp-0.0.1/index.html).
- [Архитектура библиотеки приборов](docs/platform/instrument-library.md).
- [Утверждённая спецификация ГХ: 122 ADR](docs/baselines/gc-alpha-v1/README.md).
- [Фундамент MWP](docs/mwp/README.md).
- [Инструкции для Codex](AGENTS.md).

Два учебных прототипа подключены через общий реестр и адаптер HTML; остальные приборы запланированы. Прототипы ещё не интегрированы в общее научное ядро и не валидированы экспериментально.

Сборка оболочки: `node tools/build-platform.cjs`. Проверка: `node --test tests/platform.test.cjs`.
