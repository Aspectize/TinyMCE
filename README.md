# TinyMCE
TinyMCE Aspectize Extension for tinyMCE control (https://www.tinymce.com/)

## 1 - Download

Download extension package from aspectize.com:
- in the portal, goto extension section
- browse extension, and find TinyMCE
- download package and unzip it into your local WebHost Applications directory; you should have a TinyMCE directory next to your app directory.

## 2 - Configuration

Add TinyMCE as Shared Application (or Directory) in your application configuration file.
In your Visual Studio Project, find the file Application.js in the Configuration folder.

Add TinyMCE in the Directories list : each directory should be separated by ,
```javascript
app.Directories = "TinyMCE";
```

## 3 - Include js

In your application.htm.ashx file, add the following lines:
```javascript
<!-- tinyMCE switch -->
<!-- Tiny MCE -->
<script type="text/javascript" src="~TinyMCE/tinyMCEV4/js/tinymce_4.1.9/tinymce.min.js"></script>
```

## 4 - Usage

a/ Html

Insert the following html into your control:
```html
<div aas-name='MyEditor' aas-type='TinyMCE.TinyMCEv4'></div>
```

b/ Binding

The following properties are bindable:
- Value: Html Content displayed by the editor
- EditMode: true to display editor, false to display in read only mode

