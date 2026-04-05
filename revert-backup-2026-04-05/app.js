// Single clean definition of ViewModel + binding
function ViewModel() {
    var self = this;

    self.envelopes = ko.observableArray([
        { id: 1, name: 'хартиен плик с прозорец', materials: [{ id: 101, name: 'материал 1', price: 0.01 }, { id: 102, name: 'материал 2', price: 0.02 }] },
        { id: 2, name: 'хартиен плик без прозорец', materials: [{ id: 201, name: 'материал 3', price: 0.03 }, { id: 202, name: 'материал 4', price: 0.04 }] }
    ]);

    self.selectedEnvelopeId = ko.observable(self.envelopes()[0].id);
    self.selectedEnvelope = ko.computed(function () { return ko.utils.arrayFirst(self.envelopes(), function (e) { return e.id === self.selectedEnvelopeId(); }) || null; });

    self.materialsForSelected = ko.computed(function () { var env = self.selectedEnvelope(); return env && env.materials ? env.materials : []; });
    self.selectedMaterialId = ko.observable(self.materialsForSelected().length ? self.materialsForSelected()[0].id : null);
    self.selectedEnvelopeId.subscribe(function () { var mats = self.materialsForSelected(); self.selectedMaterialId(mats.length ? mats[0].id : null); });
    self.selectedMaterial = ko.computed(function () { return ko.utils.arrayFirst(self.materialsForSelected(), function (m) { return m.id === self.selectedMaterialId(); }) || null; });

    self.height = ko.observable(100);
    self.width = ko.observable(200);

    self.quantities = ko.observableArray([10000,15000,35000,50000]);
    self.selectedQuantity = ko.observable(self.quantities()[0]);

    self.recipientCompany = ko.observable('„ПЛАСТИК-СОФИЯ“ ООД');
    self.attentionName = ko.observable('Любомир Недков');
    self.recipientPhone = ko.observable('+359 888626342');
    self.recipientEmail = ko.observable('l.nedkov@plastic-sofia.com');
    self.inquiryFrom = ko.observable('от 12.04.2021 – e-mail');

    self.recipients = ko.observableArray([
        { id:1, label:'ПЛАСТИК-СОФИЯ', company:'„ПЛАСТИК-СОФИЯ“ ООД', attention:'Любомир Недков', phone:'+359 888626342', email:'l.nedkov@plastic-sofia.com', inquiry:'от 12.04.2021 – e-mail' },
        { id:2, label:'Клиент Пример', company:'Клиент Пример ООД', attention:'Иван Петров', phone:'+359 888111222', email:'ivan@primer.bg', inquiry:'по запитване' }
    ]);

    self.selectedRecipientId = ko.observable();
    self.selectedRecipientId.subscribe(function(id){ var r = ko.utils.arrayFirst(self.recipients(), function(x){ return x.id===id; }); if(r){ self.recipientCompany(r.company||''); self.attentionName(r.attention||''); self.recipientPhone(r.phone||''); self.recipientEmail(r.email||''); self.inquiryFrom(r.inquiry||''); }});

    self.offerNumber = ko.observable('00974');
    self.offerDate = ko.observable((new Date()).toISOString().slice(0,10));
    self.offerSubject = ko.observable('Хартиени пликове KAUFLAND RO');

    self.documentDateRaw = ko.observable((new Date()).toISOString().slice(0,10));
    self.documentDate = ko.computed(function(){ var d=new Date(self.documentDateRaw()); if(isNaN(d.getTime())) d=new Date(); return d.toLocaleDateString('bg-BG', { weekday:'long', day:'2-digit', month:'long', year:'numeric' }) + ' г.'; });

    self.totalPrice = ko.computed(function(){ var qty = parseFloat(self.selectedQuantity())||0; var m = self.selectedMaterial(); var price = m && m.price?parseFloat(m.price):0; return (qty*price).toFixed(2); });

    self.exportPdf = function(){ var el = document.getElementById('pdf-content'); if(!el) return; el.classList.add('hide-actions'); var opt={ margin:0.5, filename:'export.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'in',format:'a4',orientation:'portrait'} }; var task = html2pdf().set(opt).from(el).save(); if(task && typeof task.then==='function'){ task.then(function(){ el.classList.remove('hide-actions'); }); } else { setTimeout(function(){ el.classList.remove('hide-actions'); },1000); } };

    self.printDoc = function(){ var el=document.getElementById('pdf-content'); if(!el) return; var w=window.open('','_blank'); var html='<!doctype html><html><head><meta charset="utf-8"/><title>Print</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/><style>.hide-actions .no-print{display:none !important;} @media print{ .no-print{display:none !important;} }</style></head><body><div class="hide-actions">'+el.innerHTML+'</div></body></html>'; w.document.write(html); w.document.close(); w.focus(); setTimeout(function(){ try{ w.print(); }catch(e){} },300); };

    self.items = ko.observableArray([]);
    self.addToOffer = function(){ var env=self.selectedEnvelope(); var mat=self.selectedMaterial(); var qty=parseFloat(self.selectedQuantity())||0; var w=parseFloat(self.width())||0; var h=parseFloat(self.height())||0; var p=mat && mat.price?parseFloat(mat.price):0; var total=(qty*p).toFixed(2); self.items.push({ name: env?env.name:'—', material: mat?mat.name:'—', size: w+' x '+h+' mm', printInfo: (mat && mat.price?'1 цвят':''), minOrder:'—', priceDisplay: total+' лв' }); };

    self.removeItem = function(item){ self.items.remove(item); };
    self.totalSum = ko.computed(function(){ var s=0; self.items().forEach(function(it){ var p=parseFloat((it.priceDisplay||'').toString().replace(/[^\d\.\,]/g,'').replace(',','.'))||0; s+=p; }); return s.toFixed(2)+' лв'; });
}

if(typeof ko!=='undefined') ko.applyBindings(new ViewModel()); else document.addEventListener('DOMContentLoaded', function(){ if(typeof ko!=='undefined') ko.applyBindings(new ViewModel()); });


    // избран плик (само id) и computed за обекта
    self.selectedEnvelopeId = ko.observable(self.envelopes()[0].id);
    self.selectedEnvelope = ko.computed(function () {
        var id = self.selectedEnvelopeId();
        return ko.utils.arrayFirst(self.envelopes(), function (e) { return e.id === id; }) || null;
    });

    // материали за избрания плик (computed)
    self.materialsForSelected = ko.computed(function () {
        var env = self.selectedEnvelope();
        return env && env.materials ? env.materials : [];
    });

    // избран материал (само id) и computed за обекта
    self.selectedMaterialId = ko.observable(self.materialsForSelected().length ? self.materialsForSelected()[0].id : null);
    // при смяна на плика избирай първия материал по подразбиране
    self.selectedEnvelopeId.subscribe(function () {
        var mats = self.materialsForSelected();
        self.selectedMaterialId(mats.length ? mats[0].id : null);
    });
    self.selectedMaterial = ko.computed(function () {
        var id = self.selectedMaterialId();
        return ko.utils.arrayFirst(self.materialsForSelected(), function (m) { return m.id === id; }) || null;
    });

    // останалата логика (височина, ширина, площ, export и т.н.)
    self.height = ko.observable(100);
    self.width = ko.observable(200);

    // количества (observableArray) и избрано количество
    self.quantities = ko.observableArray([10000, 15000, 35000, 50000]);
    self.selectedQuantity = ko.observable(self.quantities()[0]);

    // recipient fields bound to the PDF content
    self.recipientCompany = ko.observable('„ПЛАСТИК-СОФИЯ“ ООД');
    self.attentionName = ko.observable('Любомир Недков');
    self.recipientPhone = ko.observable('+359 888626342');
    self.recipientEmail = ko.observable('l.nedkov@plastic-sofia.com');
    self.inquiryFrom = ko.observable('от 12.04.2021 – e-mail');

    // recipients list and selection
    self.recipients = ko.observableArray([
        { id: 1, label: 'ПЛАСТИК-СОФИЯ', company: '„ПЛАСТИК-СОФИЯ“ ООД', attention: 'Любомир Недков', phone: '+359 888626342', email: 'l.nedkov@plastic-sofia.com', inquiry: 'от 12.04.2021 – e-mail' },
        { id: 2, label: 'Клиент Пример', company: 'Клиент Пример ООД', attention: 'Иван Петров', phone: '+359 888111222', email: 'ivan@primer.bg', inquiry: 'по запитване' }
    ]);
    self.selectedRecipientId = ko.observable();

    // when a recipient is selected, populate the form fields
    self.selectedRecipientId.subscribe(function (id) {
        var rec = ko.utils.arrayFirst(self.recipients(), function (r) { return r.id === id; });
        if (rec) {
            self.recipientCompany(rec.company || '');
            self.attentionName(rec.attention || '');
            self.recipientPhone(rec.phone || '');
            self.recipientEmail(rec.email || '');
            self.inquiryFrom(rec.inquiry || '');
        }
    });

    // offer metadata (dynamic)
    self.offerNumber = ko.observable('00974');
    self.offerDate = ko.observable((new Date()).toISOString().slice(0,10));
    self.offerSubject = ko.observable('Хартиени пликове KAUFLAND RO');

    // document date (displayed in Bulgarian, dynamic)
    self.documentDateRaw = ko.observable((new Date()).toISOString().slice(0,10));
    self.documentDate = ko.computed(function () {
        var raw = self.documentDateRaw();
        var d = new Date(raw);
        if (isNaN(d.getTime())) d = new Date();
        var weekday = d.toLocaleDateString('bg-BG', { weekday: 'long' });
        var day = ('0' + d.getDate()).slice(-2);
        var month = d.toLocaleDateString('bg-BG', { month: 'long' });
        var year = d.getFullYear();
        return weekday + ', ' + day + ' ' + month + ' ' + year + ' г.';
    });

    // обща стойност = количество * цена на избрания материал
    self.totalPrice = ko.computed(function () {
        var qty = parseFloat(self.selectedQuantity()) || 0;
        var mat = self.selectedMaterial(); // използва вече дефинираното selectedMaterial
        var price = mat && mat.price ? parseFloat(mat.price) : 0;
        return (qty * price).toFixed(2);
    });

    self.exportPdf = function () {
        var element = document.getElementById('pdf-content');
        var opt = {
            margin: 0.5,
            filename: 'export.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        // Temporarily hide action column by adding wrapper class on the element
        element.classList.add('hide-actions');
        var task = html2pdf().set(opt).from(element).save();
        // restore after save completes (html2pdf returns a Promise in modern builds)
        if (task && typeof task.then === 'function') {
            task.then(function () { element.classList.remove('hide-actions'); });
        } else {
            setTimeout(function () { element.classList.remove('hide-actions'); }, 1000);
        }
    };

    self.printDoc = function () {
        var element = document.getElementById('pdf-content');
        var w = window.open('', '_blank');
        // Include CSS to hide .no-print inside the new window and wrap content with .hide-actions
        var html = '<!doctype html><html><head><meta charset="utf-8"/>' +
            '<title>Print</title>' +
            '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>' +
            '<style>.hide-actions .no-print{display:none !important;} @media print{ .no-print{display:none !important;} }</style>' +
            '</head><body><div class="hide-actions">' + element.innerHTML + '</div></body></html>';
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(function () { try { w.print(); } catch (e) {} }, 300);
    };

    // items collection: allow adding multiple offer items
    self.items = ko.observableArray([]);

    self.addToOffer = function () {
        var env = self.selectedEnvelope();
        var mat = self.selectedMaterial();
        var qty = parseFloat(self.selectedQuantity()) || 0;
        var w = parseFloat(self.width()) || 0;
        var h = parseFloat(self.height()) || 0;
        var pricePerUnit = mat && mat.price ? parseFloat(mat.price) : 0;
        var total = (qty * pricePerUnit).toFixed(2);
        var item = {
            name: env ? env.name : '—',
            material: mat ? mat.name : '—',
            size: (w + ' x ' + h + ' mm'),
            printInfo: (mat && mat.price ? '1 цвят' : ''),
            minOrder: '—',
            priceDisplay: total + ' лв'
        };
        self.items.push(item);
    };

    self.removeItem = function (item) {
        self.items.remove(item);
    };

    self.totalSum = ko.computed(function () {
        var sum = 0;
        self.items().forEach(function (it) {
            var p = parseFloat((it.priceDisplay || '').toString().replace(/[^\d\.\,]/g, '').replace(',', '.')) || 0;
            sum += p;
        });
        return sum.toFixed(2) + ' лв';
    });
}

// Apply bindings when the script loads
if (typeof ko !== 'undefined') {
    ko.applyBindings(new ViewModel());
} else {
    // if ko not yet loaded, wait for DOMContentLoaded and then apply
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof ko !== 'undefined') ko.applyBindings(new ViewModel());
    });
}

            // избран плик (само id) и computed за обекта
            self.selectedEnvelopeId = ko.observable(self.envelopes()[0].id);
            self.selectedEnvelope = ko.computed(function () {
                var id = self.selectedEnvelopeId();
                return ko.utils.arrayFirst(self.envelopes(), function (e) { return e.id === id; }) || null;
            });

            // материали за избрания плик (computed)
            self.materialsForSelected = ko.computed(function () {
                var env = self.selectedEnvelope();
                return env && env.materials ? env.materials : [];
            });

            // избран материал (само id) и computed за обекта
            self.selectedMaterialId = ko.observable(self.materialsForSelected().length ? self.materialsForSelected()[0].id : null);
            // при смяна на плика избирай първия материал по подразбиране
            self.selectedEnvelopeId.subscribe(function () {
                var mats = self.materialsForSelected();
                self.selectedMaterialId(mats.length ? mats[0].id : null);
            });
            self.selectedMaterial = ko.computed(function () {
                var id = self.selectedMaterialId();
                return ko.utils.arrayFirst(self.materialsForSelected(), function (m) { return m.id === id; }) || null;
            });

            // останалата логика (височина, ширина, площ, export и т.н.)
            self.height = ko.observable(100);
            self.width = ko.observable(200);

            // количества (observableArray) и избрано количество
            self.quantities = ko.observableArray([10000, 15000, 35000, 50000]);
            self.selectedQuantity = ko.observable(self.quantities()[0]);

            // recipient fields bound to the PDF content
            self.recipientCompany = ko.observable('„ПЛАСТИК-СОФИЯ“ ООД');
            self.attentionName = ko.observable('Любомир Недков');
            self.recipientPhone = ko.observable('+359 888626342');
            self.recipientEmail = ko.observable('l.nedkov@plastic-sofia.com');
            self.inquiryFrom = ko.observable('от 12.04.2021 – e-mail');

            // recipients list and selection
            self.recipients = ko.observableArray([
                { id: 1, label: 'ПЛАСТИК-СОФИЯ', company: '„ПЛАСТИК-СОФИЯ“ ООД', attention: 'Любомир Недков', phone: '+359 888626342', email: 'l.nedkov@plastic-sofia.com', inquiry: 'от 12.04.2021 – e-mail' },
                { id: 2, label: 'Клиент Пример', company: 'Клиент Пример ООД', attention: 'Иван Петров', phone: '+359 888111222', email: 'ivan@primer.bg', inquiry: 'по запитване' }
            ]);
            self.selectedRecipientId = ko.observable();

            // when a recipient is selected, populate the form fields
            self.selectedRecipientId.subscribe(function (id) {
                var rec = ko.utils.arrayFirst(self.recipients(), function (r) { return r.id === id; });
                if (rec) {
                    self.recipientCompany(rec.company || '');
                    self.attentionName(rec.attention || '');
                    self.recipientPhone(rec.phone || '');
                    self.recipientEmail(rec.email || '');
                    self.inquiryFrom(rec.inquiry || '');
                }
            });

            // offer metadata (dynamic)
            self.offerNumber = ko.observable('00974');
            self.offerDate = ko.observable((new Date()).toISOString().slice(0,10));
            self.offerSubject = ko.observable('Хартиени пликове KAUFLAND RO');

            // document date (displayed in Bulgarian, dynamic)
            self.documentDateRaw = ko.observable((new Date()).toISOString().slice(0,10));
            self.documentDate = ko.computed(function () {
                var raw = self.documentDateRaw();
                var d = new Date(raw);
                if (isNaN(d.getTime())) d = new Date();
                var weekday = d.toLocaleDateString('bg-BG', { weekday: 'long' });
                var day = ('0' + d.getDate()).slice(-2);
                var month = d.toLocaleDateString('bg-BG', { month: 'long' });
                var year = d.getFullYear();
                return weekday + ', ' + day + ' ' + month + ' ' + year + ' г.';
            });

            // обща стойност = количество * цена на избрания материал
            self.totalPrice = ko.computed(function () {
                var qty = parseFloat(self.selectedQuantity()) || 0;
                var mat = self.selectedMaterial(); // използва вече дефинираното selectedMaterial
                var price = mat && mat.price ? parseFloat(mat.price) : 0;
                return (qty * price).toFixed(2);
            });

            self.exportPdf = function () {
                var element = document.getElementById('pdf-content');
                var opt = {
                    margin: 0.5,
                    filename: 'export.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                };
                // Temporarily hide action column by adding wrapper class on the element
                element.classList.add('hide-actions');
                var task = html2pdf().set(opt).from(element).save();
                // restore after save completes (html2pdf returns a Promise in modern builds)
                if (task && typeof task.then === 'function') {
                    task.then(function () { element.classList.remove('hide-actions'); });
                } else {
                    setTimeout(function () { element.classList.remove('hide-actions'); }, 1000);
                }
            };

            self.printDoc = function () {
                var element = document.getElementById('pdf-content');
                var w = window.open('', '_blank');
                // Include CSS to hide .no-print inside the new window and wrap content with .hide-actions
                var html = '<!doctype html><html><head><meta charset="utf-8"/>' +
                    '<title>Print</title>' +
                    '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>' +
                    '<style>.hide-actions .no-print{display:none !important;} @media print{ .no-print{display:none !important;} }</style>' +
                    '</head><body><div class="hide-actions">' + element.innerHTML + '</div></body></html>';
                w.document.write(html);
                w.document.close();
                w.focus();
                setTimeout(function () { try { w.print(); } catch (e) {} }, 300);
            };

            // items collection: allow adding multiple offer items
            self.items = ko.observableArray([]);

            self.addToOffer = function () {
                var env = self.selectedEnvelope();
                var mat = self.selectedMaterial();
                var qty = parseFloat(self.selectedQuantity()) || 0;
                var w = parseFloat(self.width()) || 0;
                var h = parseFloat(self.height()) || 0;
                var pricePerUnit = mat && mat.price ? parseFloat(mat.price) : 0;
                var total = (qty * pricePerUnit).toFixed(2);
                var item = {
                    name: env ? env.name : '—',
                    material: mat ? mat.name : '—',
                    size: (w + ' x ' + h + ' mm'),
                    printInfo: (mat && mat.price ? '1 цвят' : ''),
                    minOrder: '—',
                    priceDisplay: total + ' лв'
                };
                self.items.push(item);
            };

            self.removeItem = function (item) {
                self.items.remove(item);
            };

            self.totalSum = ko.computed(function () {
                var sum = 0;
                self.items().forEach(function (it) {
                    var p = parseFloat((it.priceDisplay || '').toString().replace(/[^\d\.\,]/g, '').replace(',', '.')) || 0;
                    sum += p;
                });
                return sum.toFixed(2) + ' лв';
            });
        }

        // Apply bindings when the script loads
        if (typeof ko !== 'undefined') {
            ko.applyBindings(new ViewModel());
        } else {
            // if ko not yet loaded, wait for DOMContentLoaded and then apply
            document.addEventListener('DOMContentLoaded', function () {
                if (typeof ko !== 'undefined') ko.applyBindings(new ViewModel());
            });
        }
