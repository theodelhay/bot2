/*
 *  commands.js
 *  Toutes (ou presque) les commandes du bot
 *  doivent se trouver ici.
 *  Doc:
 *  Pour une commande de type:
 *  /cmd param1, param2
 *  La variable params contient les paramètres
 *  de la commande, qui sont à parser comme on veut
 *  from: celui qui exécute la commande
 *  room: room où la commande a été lancée
 */
var fs = require('fs');

exports.Cmd = {
    about: function(c, params, from, room) {
        var txt = 'Bot créé par Keb avec la technologie javascript côté serveur node.js';
        if (!this.isranked(from, '+')) {
            this.talk(c, room, txt);
        } else {
            this.talk(c, room, '/pm ' + from + ', ' + txt);
        }
    },
    '8ball': function(c, params, from, room) {
        var phrases = fs.readFileSync('data/8ball.txt').toString().split("\n");
        var random = Math.floor((Math.random() * phrases.length) + 1);

        if (this.isRanked(from, '+')) {
            this.talk(c, room, '(' + from.substr(1) + ') ' + phrases[random]);
        } else {
            this.talk(c, room, '/pm ' + from + ', ' + phrases[random]);
        }
    },
    talk: function(c, params, from, room) {
        if (!this.isRanked(from, '@')) return false;
        var txt = 'Réponses automatiques ';
        if (params === 'on') {
            autoR = true;
            txt += 'activées.';
        } else if (params === 'off') {
            autoR = false;
            txt += 'désactivées.'
        } else {
            //Précaution
            txt = 'Vous devez utiliser le paramètre "on" ou "off".'
        }
        this.talk(c, room, txt);
    },
    ab: function(c, params, from, room) {
        if (!this.isRanked(from, '@') || !params) return false;
        var opts = params.split(',');
        var data = makeId(opts[0]) + '|' + room + '|' + opts[1];
        fs.appendFile('data/banlist.txt', '\n' + data, function(err) {
            console.log(err);
        });
        //On vire les sauts de lignes inutiles
        var e = fs.readFileSync('data/banlist.txt').toString();
        var output = e.replace(/^\s*$[\n\r]{1,}/gm, '');
        fs.writeFileSync('data/banlist.txt', output);
        this.talk(c, room, 'Ban permanant pour ' + opts[0] + ': ' + opts[1]);
    },
    aub: function(c, params, from, room) {
        if (!this.isRanked(from, '#') || !params) return false;

        var success = false;
        var banlist = fs.readFileSync('data/banlist.txt').toString().split('\n');
        var editedbanlist = fs.readFileSync('data/banlist.txt').toString();

        for (var i = 0; i < banlist.length; i++) {
            var spl = banlist[i].toString().split('|');
            if (makeId(params) == spl[0]) {
                var search = spl[0] + '|' + spl[1] + '|' + spl[2];
                var idx = editedbanlist.indexOf(search);
                if (idx >= 0) {
                    var output = editedbanlist.substr(0, idx) + editedbanlist.substr(idx + search.length);
                    //On tej la ligne vide inutile qui fait planter le script
                    var output = output.replace(/^\s*$[\n\r]{1,}/gm, '');
                    fs.writeFileSync('data/banlist.txt', output);
                    this.talk(c, room, spl[0] + ' a bien été débanni.');
                    success = true;
                }
            }
        }
        if (success == false) this.talk(c, room, params + ' n\'est pas banni.');
    },
    banword: function(c, params, from, room) {
        //if (!this.isRanked(from, '@') || !params) return false;
        fs.appendFile('data/bannedwords.txt', params + '|' + room + '\n', function(err) {
            console.log(err);
        });
        this.talk(c, room, 'Le mot "' + params + '" a bien été banni de la room ' + room + '.');
    },
    unbanword: function(c, params, from, room) {
        //if (!this.isRanked(from, '#') || !params) return false;

        var success = false;
        var bannedwords = fs.readFileSync('data/bannedwords.txt').toString().split('\n');
        var editedBannedWords = fs.readFileSync('data/bannedwords.txt').toString();

        for (var i = 0; i < bannedwords.length; i++) {
            var spl = bannedwords[i].toString().split('|');
            if (makeId(params) == spl[0] && spl[1] == room) {
                var search = spl[0] + '|' + spl[1];
                var idx = editedBannedWords.indexOf(search);
                if (idx >= 0) {
                    var output = editedBannedWords.substr(0, idx) + editedBannedWords.substr(idx + search.length);
                    var output = output.replace(/^\s*$[\n\r]{1,}/gm, '');
                    fs.writeFileSync('data/bannedwords.txt', output);
                    this.talk(c, room, 'Le mot ' + spl[0] + ' a bien été débanni.');
                    success = true;
                }
            }
        }
        if (success == false) this.talk(c, room, 'Le mot "' + params + '" n\'est pas banni.');
    }
};
