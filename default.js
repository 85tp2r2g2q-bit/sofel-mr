(function () {
	window.SOFEL_DEFAULTS = {
		defaultRecipients: [
			{ id: 1, label: 'ПЛАСТИК-СОФИЯ', company: '„ПЛАСТИК-СОФИЯ“ ООД', attention: 'Любомир Недков', phone: '+359 888626342', email: 'l.nedkov@plastic-sofia.com', inquiry: 'от 12.04.2021 – e-mail' },
			{ id: 2, label: 'Клиент Пример', company: 'Клиент Пример ООД', attention: 'Иван Петров', phone: '+359 888111222', email: 'ivan@primer.bg', inquiry: 'по запитване' }
		],
		defaultPriceIndexes: [
			{ idx: 1, name: 'Стандартна оферта[Local]' },
			{ idx: 0.95, name: 'За търговци[Local]' },
			{ idx: 0.85, name: 'Пластик София[Local]' }
		],
		defaultMaterials: [
			{ id: 301, name: 'Бял Крафт', nameEN: 'White Kraft', price: [
				{ grammage: 30, value: 1.2 },
				{ grammage: 32, value: 1.2 },
				{ grammage: 35, value: 1.2 },
				{ grammage: 38, value: 1.15 },
				{ grammage: 40, value: 1.15 },
				{ grammage: 45, value: 1.1 },
				{ grammage: 50, value: 1.1 },
				{ grammage: 70, value: 0.98 },
				{ grammage: 80, value: 0.98 },
				{ grammage: 90, value: 0.96 }
			] },
			{ id: 302, name: 'Кафяв Крафт', nameEN: 'Brown Kraft', price: [
				{ grammage: 30, value: 1.15 },
				{ grammage: 32, value: 1.15 },
				{ grammage: 35, value: 1.1 },
				{ grammage: 38, value: 1.1 },
				{ grammage: 40, value: 1.05 },
				{ grammage: 45, value: 1.05 },
				{ grammage: 50, value: 1.0 },
				{ grammage: 70, value: 0.9 },
				{ grammage: 80, value: 0.9 },
				{ grammage: 90, value: 0.86 }
			] },
			{ id: 303, name: 'Екструдиран Крафт', nameEN: 'Extruded Kraft', price: [
				{ grammage: 40, value: 2.2 },
				{ grammage: 45, value: 2.2 }
			] },
			{ id: 304, name: 'Маслоустойчив Крафт', nameEN: 'Greaseproof Kraft', price: [
				{ grammage: 40, value: 1.85 },
				{ grammage: 45, value: 1.85 },
				{ grammage: 50, value: 1.85 }
			] }
		],
		defaultPrintColors: [
			{ count: 0, value: 0 },
			{ count: 1, value: 3 },
			{ count: 2, value: 5 },
			{ count: 3, value: 7 },
			{ count: 4, value: 10 }
		]
	};
})();
