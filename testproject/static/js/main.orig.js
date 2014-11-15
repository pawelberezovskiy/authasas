var editor; //  a global for the submit

$(document).ready(function() {
        editor = new $.fn.dataTable.Editor( {
                ajax: "/api/",
                table: "#example",
                fields: [ {
                                label: "Domain:",
                                name: "address"
                        }, {
                                label: "Port:",
                                name: "port"
                        }, {
                                label: "Is SSL:",
                                name: "ssl"
                        }
                ]
        } );

        // Activate an inline edit on click of a table cell
        $('#example').on( 'click', 'tbody td:not(:first-child)', function (e) {
                editor.inline( this );
        } );

        $('#example').DataTable( {
                dom: "Tfrtip",
                ajax: "/api/",
                columns: [
                        { data: null, defaultContent: '', orderable: false },
                        { data: "address" },
                        { data: "port" },
                        { data: "ssl" },
                ],
                order: [ 1, 'asc' ],
                tableTools: {
                        sRowSelect: "os",
                        sRowSelector: 'td:first-child',
                        aButtons: [
                                { sExtends: "editor_create", editor: editor },
                                { sExtends: "editor_edit",   editor: editor },
                                { sExtends: "editor_remove", editor: editor }
                        ]
                }
        } );
} );

