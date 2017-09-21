/*
 * Copyright (C) 2017 Nethesis S.r.l.
 * http://www.nethesis.it - nethserver@nethesis.it
 *
 * This script is part of NethServer.
 *
 * NethServer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * NethServer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with NethServer.  If not, see COPYING.
 */

(function ($) {
    nethserver.System.summary = {
        /**
         * Retrieve the static host by reading /etc/hostname
         * @return {Promise} from cockpit.file
         */
        getHostname: function () {
            var fh = cockpit.file("/etc/hostname", {
                syntax: nethserver.Syntax.trimWhitespace
            });
            return fh.read().always(function () {
                fh.close();
            });
        },

        getSystemAliases: function () {
            console.warn('deprecated');
            var dfr = $.Deferred();
            dfr.resolve();
            return dfr;
        },

        /**
         * Set the system host name
         * @return {Promise}
         */
        setHostname: function (hostname) {
            var client = cockpit.dbus('org.freedesktop.hostname1', {
                'superuser': 'require'
            });
            var dfr = $.Deferred();

            client.wait(function(){
                client.call('/org/freedesktop/hostname1', 'org.freedesktop.hostname1',
                            'SetStaticHostname', [hostname, false]).
                done(function(){
                    nethserver.signalEvent('hostname-modify').
                    done(dfr.resolve).
                    fail(dfr.reject);
                }).
                fail(dfr.reject);
            });

            return dfr.always(function(){
                client.close();
            });
        },

        getHardware: function () {
            return $.Deferred(function (dfr) {
                cockpit.spawn(["grep", "\\w", "sys_vendor", "product_name"], {
                    directory: "/sys/devices/virtual/dmi/id",
                    err: "ignore"
                }).
                done(function (fields) {
                    fields = nethserver.Syntax.grepToObject.parse(fields);
                    dfr.resolve(fields.sys_vendor + " " + fields.product_name);
                }).
                fail(function () {
                    dfr.reject();
                });
            });
        },

        getMachineId: function () {
            var fh = cockpit.file("/etc/machine-id", {
                syntax: nethserver.Syntax.trimWhitespace
            });
            return fh.read().always(function () {
                fh.close();
            });
        },

        getOS: function () {
            var fh = cockpit.file("/etc/nethserver-release");
            return fh.read().always(function () {
                fh.close();
            });
        },

        getNTPServer: function () {
            return cockpit.spawn(['date', '+%F %H:%M']);
        },

        getSystemTimeMode: function () {
            return cockpit.spawn(['date', '+%F %H:%M']);
        },

        getSystemTimeZone: function () {
            return cockpit.spawn(['date', '+%F %H:%M']);
        },

        getTimeZones: function () {
            return cockpit.spawn(["/usr/bin/timedatectl", "list-timezones"]);
        },

        getSystemTime: function () {
            return cockpit.spawn(['date', '+%F %H:%M']);
        },

        setSystemTime: function (val) {
            return $.Deferred(function (dfr) {
                cockpit.spawn(['date', val]).
                done(function (out) {
                    nethserver.signalEvent('nethserver-ntp-save', val).
                    done(dfr.resolve).
                    fail(dfr.reject);
                }).
                fail(dfr.reject);
            });
        }
    };
})(jQuery);