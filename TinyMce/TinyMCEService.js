/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisenseLibrary.js" />

Global.TinyMCEService = {

    aasService: 'TinyMCEService',
    aasPublished: true,

    UnloadTinyMCE: function (controlName) {

        if (Aspectize.Can && Aspectize.Can('aasClose')) return;

        function unloadTinyMCE() {
            if (typeof (tinyMCE) !== 'undefined') {
                tinymce.each(tinyMCE.editors, function (e) {
                    if (typeof (e) !== 'undefined' && e.id == controlName) {
                        try {
                            tinymce.remove(e); //('#' + jq(e.id));
                        }
                        catch (ex) {

                        }
                    }
                });
            }
        }

        unloadTinyMCE();
    }

};

