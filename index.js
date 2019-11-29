const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');

const mainUrl = 'https://www.morphmarket.com/';

const urls = [];

const object = {
    snakes: []
};

request(`${mainUrl}us/c/reptiles/pythons/ball-pythons/index`, function (error, response, body) {
    const $ = cheerio.load(body);
    $('.dropdown-menu li a').each(function () {
        const url = $(this).attr('href');
        urls.push(`${mainUrl}${url}`);
    })

    console.log(urls)
});

for (let item of urls) {
    const regExp = /reptiles\/([a-z]+)\/([a-z -]+)/gm;
    const itemName = item.split(regExp)[2];

    const morphs = [];
    const local = [];
    const sub = [];

    request(item, function (error, response, body) {
        if (error) throw new Error(error);
        const $ = cheerio.load(body);

        $(".morph-label a").each(function () {
            const clearText = $(this).text().trim();
            console.log(clearText);
            if (clearText !== '') morphs.push(clearText);
        });

        if ($('.feature-counts')) {

            $('.feature-counts').each(function () {
                const clearText = $(this).text().trim();
                if (clearText !== '' && clearText.match(/\d+/gm) == null) {
                    console.log($('.row.gene-index').prev().text())
                    const parentTitle = $(this).parent().parent().parent().prev()
                    if (parentTitle.text() === 'Subcategories') {
                        sub.push(clearText)
                    } else {
                        local.push(clearText)
                    };
                };
            });
        }

        object.snakes.push({
            name: itemName,
            morphs: [...morphs],
            local: [...local],
            sub: [...sub]
        });

        fs.writeFile('db.json', JSON.stringify(object), function (err, data) {
            return morphs;
        });
    });
}








