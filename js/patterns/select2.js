// plone integration for textext.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//    ++resource++plone.app.widgets/textext.js
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'js/patterns/base',
  'jam/select2/select2'
], function($, Base) {
  "use strict";

  var Select2 = Base.extend({
    name: "select2",
    defaults: {},
    init: function() {
      var self = this;

      if (self.options.initselection) {
        self.options.initSelection = function ($el, callback) {
          var data = [], value = $el.val(),
              initSelection = self.options.initselection;
          if (typeof(initSelection) === 'string') {
              initSelection = JSON.parse(self.options.initselection);
          }
          $(value.split(",")).each(function () {
            var text = this;
            if (initSelection[this]) {
              text = initSelection[this];
            }
            data.push({id: this, text: text});
          });
          callback(data);
        };
      }


      if (self.options.ajax || self.options.ajaxtags) {
        if (self.options.ajaxtags) {
          self.options.multiple = true;
          self.options.ajax = self.options.ajax || {};
          self.options.ajax.url = self.options.ajaxtags;
          self.options.initSelection = function ($el, callback) {
            var data = [], value = $el.val();
            $(value.split(",")).each(function () {
              data.push({id: this, text: this});
            });
            callback(data);
          };
        }
        var query_term = '';
        self.options.ajax = $.extend({
          quietMillis: 300,
          data: function (term, page) {
            query_term = term;
            return {
              query: term,
              page_limit: 10,
              page: page
            };
          },
          results: function (data, page) {
            var results = data.results;
            if (self.options.ajaxtags) {
              var data_ids = [];
              $.each(data.results, function(i, item) {
                data_ids.push(item.id);
              });
              results = [];
              if (query_term !== ''  && $.inArray(query_term, data_ids) === -1) {
                results.push({id:query_term, text:query_term});
              }
              $.each(data.results, function(i, item) {
                results.push(item);
              });
            }
            return { results: results };
          }
        }, self.options.ajax);
      }

      if (self.options.tags && typeof(self.options) === 'string') {
        if (self.options.tags.substr(0, 1) === '[') {
          self.options.tags = JSON.parse(self.options.tags);
        } else {
          self.options.tags = self.options.tags.split(',');
        }
      }

      self.$el.select2(self.options);
      self.$el.parent().off('close.modal.patterns');
    }
  });

  return Select2;

});