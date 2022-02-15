
function jq(myid) {
    return myid.replace(/(:|;|\.|\[|\])/g, "\\$1");
}


Aspectize.Extend("TinyMCEv4", {
    Properties: { EditMode: true, Value: '', CustomImage: '', CustomLink: '', RelativeUrls: false, Inline: false, MenuBar: false, StatusBar: false, WordCount: false, DisableIFrame: false, RemoveTrailingBrs: true },
    Events: ['OnCustomImage', 'OnCustomLink'],
    Init: function (elem) {

        var initProperties = {};
        var editorCreated = false;

        if (Aspectize.Can && Aspectize.Can('aasClose')) {

            elem.aasClose = function () {

                tinyMCE.remove('#' + jq(elem.id));
            };
        }

        var ctrlInfo = elem.aasControlInfo;

        ctrlInfo.aasBeforeModalChange = function (sender) {

            if (editorCreated) {

                var editor = tinyMCE.get(elem.id);

                if (editor) {

                    editor.save();
                    tinyMCE.remove('#' + jq(elem.id));

                    editorCreated = false;
                }
            }
        };

        ctrlInfo.aasAfterModalViewChange = function (sender) {

            if (!editorCreated) { loadTinyMCE(elem); editorCreated = true; }
        };

        function loadTinyMCE(elem) {

            var thisEditor = null;

            function notifyChange() {
                if (tinyMCE) {
                    var element = tinyMCE.get(elem.id);

                    if (element) {
                        var content = element.getContent();
                        aasOldValue = content;
                        Aspectize.UiExtensions.ChangeProperty(elem, 'Value', content);
                    }
                }
            }

            var editMode = Aspectize.UiExtensions.GetProperty(elem, 'EditMode');
            var options = {
                language: 'fr_FR',
                selector: '#' + jq(elem.id),
                allow_script_urls: true,
                remove_trailing_brs: Aspectize.UiExtensions.GetProperty(elem, 'RemoveTrailingBrs'),
                visual_table_class: editMode ? 'mce-item-table' : 'my-custom-class',
                relative_urls: Aspectize.UiExtensions.GetProperty(elem, 'RelativeUrls'),
                remove_script_host: Aspectize.UiExtensions.GetProperty(elem, 'RelativeUrls'),
                convert_urls: Aspectize.UiExtensions.GetProperty(elem, 'RelativeUrls'),
                inline: Aspectize.UiExtensions.GetProperty(elem, 'Inline'),
                plugins: ["spellchecker pagebreak save directionality noneditable visualchars nonbreaking template advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table contextmenu paste textcolor" + ((Aspectize.UiExtensions.GetProperty(elem, 'WordCount')) ? ' wordcount' : '')],
                readonly: !editMode,
                toolbar_mode: 'wrap',
                valid_elements: '*[*]',
                toolbar_items_size: 'small',
                toolbar: (!editMode) ? false : 'bold italic underline strikethrough | removeformat | alignleft aligncenter alignright alignjustify | styleselect fontselect fontsizeselect | cut copy paste pastetext pasteword | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink ' + ((Aspectize.UiExtensions.GetProperty(elem, 'CustomLink')) ? 'customlinkbutton ' : '') + ((Aspectize.UiExtensions.GetProperty(elem, 'CustomImage')) ? 'customimagebutton ' : '') + 'image ' + ((Aspectize.UiExtensions.GetProperty(elem, 'DisableIFrame')) ? ' ' : 'media ') + 'code | anchor | forecolor backcolor | table | hr | sub sup | charmap',
                setup: function (editor) {

                    thisEditor = editor;
                    var customImage = Aspectize.UiExtensions.GetProperty(elem, 'CustomImage');
                    if (customImage) {
                        var customImageTitle = 'Custom Image';
                        if (typeof customImage === 'string') {
                            customImageTitle = customImage;
                        }
                        if (editor.ui && editor.ui.registry) {
                            editor.ui.registry.addButton('customimagebutton', {
                                tooltip: customImageTitle,
                                icon: 'gallery',
                                onAction: function () {
                                    var customImageLink = {
                                        callback: function (imageUrl) {
                                            if (imageUrl) {
                                                var imageDiv = '<img src="' + imageUrl + '" />';
                                                editor.focus();
                                                editor.selection.setContent(imageDiv);
                                            }
                                        }
                                    };
                                    Aspectize.UiExtensions.Notify(elem, 'OnCustomImage', customImageLink);
                                },
                                onSetup: function (buttonApi) {
                                    //$('.tox').css('z-index', '1000');
                                }
                            });
                        } else if (editor.addButton) {
                            editor.addButton('customimagebutton', {
                                title: customImageTitle,
                                image: '../Applications/TinyMce/images/Image16Add.png',
                                onclick: function () {
                                    var customImageLink = {
                                        callback: function (imageUrl) {
                                            if (imageUrl) {
                                                var imageDiv = '<img src="' + imageUrl + '" />';
                                                editor.focus();
                                                editor.selection.setContent(imageDiv);
                                            }
                                        }
                                    };
                                    Aspectize.UiExtensions.Notify(elem, 'OnCustomImage', customImageLink);
                                }
                            });
                        }
                    }
                    var customLink = Aspectize.UiExtensions.GetProperty(elem, 'CustomLink');

                    if (customLink) {
                        var customLinkTitle = 'Custom Link';
                        if (typeof customLink === 'string') {
                            customLinkTitle = customLink;
                        }
                        if (editor.ui && editor.ui.registry) {
                            editor.ui.registry.addButton('customlinkbutton', {
                                tooltip: customLinkTitle,
                                icon: 'link',
                                onAction: function () {
                                    //editor.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
                                    var linkText = editor.selection.getContent();
                                    var customImageLink = {
                                        callback: function (linkHref, linkOnClick) {
                                            var menuDiv = '<a ';
                                            if (linkHref) { menuDiv = menuDiv + 'href="' + linkHref + '" '; }
                                            if (linkOnClick) { menuDiv = menuDiv + 'onclick="' + linkOnClick + '" '; }
                                            menuDiv = menuDiv + '>' + linkText + '</a>';
                                            editor.focus();
                                            editor.selection.setContent(menuDiv);
                                        }
                                    };
                                    Aspectize.UiExtensions.Notify(elem, 'OnCustomLink', customImageLink);
                                },
                                onSetup: function (buttonApi) {
                                    //$('.tox').css('z-index', '1000');
                                }
                            });
                        } else if (editor.addButton) {
                            editor.addButton('customlinkbutton', {
                                title: customLinkTitle,
                                image: '../Applications/TinyMce/images/DynamicLinkAdd.png',
                                onclick: function () {
                                    var linkText = editor.selection.getContent();
                                    var customImageLink = {
                                        callback: function (linkHref, linkOnClick) {
                                            var menuDiv = '<a ';
                                            if (linkHref) { menuDiv = menuDiv + 'href="' + linkHref + '" '; }
                                            if (linkOnClick) { menuDiv = menuDiv + 'onclick="' + linkOnClick + '" '; }
                                            menuDiv = menuDiv + '>' + linkText + '</a>';
                                            editor.focus();
                                            editor.selection.setContent(menuDiv);
                                        }
                                    };
                                    Aspectize.UiExtensions.Notify(elem, 'OnCustomLink', customImageLink);
                                }
                            });
                        }
                    }

                    editor.on('change', function (e) { setTimeout(notifyChange, 0); });
                }
            };

            if ((!Aspectize.UiExtensions.GetProperty(elem, 'StatusBar') && !Aspectize.UiExtensions.GetProperty(elem, 'WordCount')) || !editMode) options.statusbar = false;
            if (!Aspectize.UiExtensions.GetProperty(elem, 'MenuBar')) options.menubar = false;

            tinyMCE.init(options);

            Aspectize.DebugTrace("loadTinyMCE");

            return thisEditor;
        }

        Aspectize.UiExtensions.AddMergedPropertyChangeObserver(elem, function (sender, arg) {

            if (!editorCreated) { loadTinyMCE(elem); editorCreated = true; }

            var editor = tinyMCE.get(elem.id);

            var hasValue = !!arg.Value;
            var editMode = ('EditMode' in arg) ? arg.EditMode : 'no EditMode';
            Aspectize.DebugTrace("change {2} editor has Value : {0} EditMode {1}", hasValue, editMode, editor ? 'with' : 'no');

            if ('Value' in arg) {

                arg.Value = arg.Value || '';

                if (editor) {

                    //  var old = editor.getContent();
                    //  if (old !== arg.Value) editor.setContent(initProperties.Value);

                    editor.setContent(arg.Value);

                } else elem.innerHTML = arg.Value;
            }

            if ('EditMode' in arg) {

                if (editor) {

                    editor.save();
                    tinyMCE.remove('#' + jq(elem.id));
                    loadTinyMCE(elem);
                }
            }
        });
    }
});

