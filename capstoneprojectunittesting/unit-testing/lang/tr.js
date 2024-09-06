(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['unitTestingTask'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('unitTestingTask'));
    } else {
        factory(window.unitTestingTask);
    }
}(function (unitTestingTask) {
    unitTestingTask.lang('tr', {
        _months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
        months: function (date) {
            return this._months[date.getMonth()];
        },
        _monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
        monthsShort: function (date) {
            return this._monthsShort[date.getMonth()];
        },
        weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
        weekdaysShort: 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
        weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_')
    });
}));
