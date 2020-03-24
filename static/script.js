function getInfo(search = false) {
    $('#localtime').text(new Date().toString().split('(')[0].trim());
    $('#platform').text(navigator.platform);
    $('#useragent').text(navigator.userAgent);
    if (search) {
        doQuery($('#input').val());
    } else {
        $('#input').val('');
        doQuery();
    };
};

function doQuery(ip = '') {
    var api = 'https://api.ipdata.co/{ip}?api-key=YOUR_API_KEY';
    if ($('#online').prop('checked')) {
        query('/query?ip=' + ip);
    } else {
        query(api.replace('{ip}', ip));
    };
};

function query(api) {
    $('.info').text('');
    $('.info').addClass('loading');
    $('.flag').removeAttr('src');
    $.getJSON(api).done(json => {
        document.title = 'IP: ' + json.ip;
        $.each(json, function (key, value) {
            fill(key, value);
        });
        fill('isp', json.asn, 'name');
        fill('org', json.carrier, 'name');
        fill('timezone', json.time_zone, 'name');
        $('.flag').attr('src', json.flag);
    }).fail(error => {
        document.title = 'My IP';
        $('.info').text('N/A');
        try {
            alert('Error!\n\n' + error.responseJSON.message);
        } catch (e) {
            alert('Error!');
        }
    }).always(() => {
        $('.info').removeClass('loading');
    });
};

function fill(element, data, key = '') {
    if (data != undefined) {
        if (key == '') {
            var value = data;
        } else {
            var value = data[key];
        };
        if (value != '' && value != null) {
            $('#' + element).text(value);
        } else {
            $('#' + element).text('N/A');
        };
    } else {
        $('#' + element).text('N/A');
    };
};
