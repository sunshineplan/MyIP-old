function getInfo(search = false) {
    $('#localtime').text(new Date().toString().split('(')[0].trim());
    $('#platform').text(navigator.platform);
    $('#useragent').text(navigator.userAgent);
    if (search) doQuery($('#input').val());
    else {
        $('#input').val('');
        doQuery();
    };
};

function doQuery(ip = '') {
    var api = 'https://api.ipdata.co/{ip}?api-key=' + API_KEY;
    if ($('#online').prop('checked')) query('/query?ip=' + ip);
    else if (ip == '' || ipaddr.isValid(ip)) query(api.replace('{ip}', ip));
    else {
        console.log('Host must be searched on server side.');
        query('/query?ip=' + ip);
    };
};

function query(api) {
    var BootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'swal btn btn-primary'
        },
        buttonsStyling: false
    });
    $('.info').text('');
    $('.info').addClass('loading');
    $('.flag').removeAttr('src');
    $.getJSON(api).done(json => {
        document.title = 'IP: ' + json.ip;
        $.each(json, (key, value) => fill(key, value));
        fill('isp', json.asn, 'name');
        fill('org', json.carrier, 'name');
        fill('timezone', json.time_zone, 'name');
        $('.flag').attr('src', json.flag);
    }).fail(error => {
        document.title = 'My IP';
        $('.info').text('N/A');
        try {
            BootstrapButtons.fire('Error', error.responseJSON.message, 'error');
        } catch (e) {
            BootstrapButtons.fire('Error', 'Unknown error!', 'error');
        }
    }).always(() => $('.info').removeClass('loading'));
};

function fill(element, data, key = '') {
    var value;
    if (data != undefined) {
        if (key == '') value = data; else value = data[key];
        if (value != '' && value != null) $('#' + element).text(value); else $('#' + element).text('N/A');
    } else $('#' + element).text('N/A');
};
