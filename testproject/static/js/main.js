
 function validate_domain(domain){
  var reg = new RegExp("[^a-z0-9-.]","i");

  if(reg.test(domain) == true){
   return false;
  }
return  true;
}

$(function(){

var HomeRouter = Backbone.Router.extend({
 
    routes: {
        'editAddressDialog' : 'editAddressDialog',
        'editPortDialog' : 'editPortDialog',
//        'editSslDialog' : 'editSslDialog',
    },
});


var HomeView = Backbone.View.extend({

    // our default table view
    'router' : new HomeRouter(),
    'events': {
        'click td.address':   'editAddressDialog',
        'click td.port:not(:first-child)':   'editPortDialog',
//        'click td.ssl:not(:first-child)':   'editSslDialog',
    },
    'editAddressDialog': function( event ) {
        this.editor.inline( event.target );
    },
    'editSslDialog': function( event ) {
        this.editor.inline( event.target );
    },
    'editPortDialog': function( event ) {
        var val = $(event.target).html() ;
        if ( val && val % 1 === 0 )
            console.log(val);
            this.editor.inline( event.target );
    },

    'initialize': function() {

    var view = this;
    // setup routes

    view.router.on('route:editAddressDialog', function() {
        view.editAddressDialog();
    });
    view.router.on('route:editSslDialog', function() {
        view.editSslDialog();
    });

    view.router.on('route:editPortDialog', function() {
        view.editPortDialog();
    });

    // setup table
    //
        view.editor = new $.fn.dataTable.Editor( {
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
                                name: "ssl",
                                type:  "radio",
                                ipOpts: [
                    { label: "False", value: "false" },
                    { label: "True",           value: "true" },
                                 ],

                        }
                ]
        } );

    view.editor.on( 'preSubmit', function ( e, o ) {
        if (o.action == 'edit') {

        if (o.data && o.data.address === '' ) {
            this.error('address', 'A domain must be given');
            return false;
        }
        else if (o.data && o.data.address.length >= 50 ) {
            this.error('address', 'The Domain less that 50 characters');
            return false;
        }
        else if (o.data && !  validate_domain(o.data.address )) {
            this.error('address', 'The Domain name not valid');
            return false;
        }

        if (o.data && o.data.port === '' ) {
            this.error('port', 'A domain port must be given');
            return false;
        }
        else if (o.data &&  isNaN(o.data.port)  ) {
            this.error('port', 'The Domain must be a number');
            return false;
        }
        else if (o.data && o.data.port > 4096   ) {
            this.error('port', 'The Domain must be less 4096 ');
            return false;
        }

        }
    } );

//    $('#example').on( 'click', 'tbody td:not(:first-child)', function (e) {
//    view.editor.inline( this );
//    } );

        view.table = $('#example').DataTable( {
                dom: "Tfrtip",
                ajax: "/api/",
                columns: [
//                        { data: null, defaultContent: '', orderable: false },
                        { data: "address", class:'address'},
                        { data: "port" , class:'port' ,render: $.fn.dataTable.render.number(  0 ) },
                        { data: "ssl", class:'ssl'},
                ],
                order: [ 1, 'asc' ],
                tableTools: {
                        sRowSelect: "os",
                        sRowSelector: 'td:first-child',
                        aButtons: [
                                { sExtends: "editor_create", editor: view.editor },
                                { sExtends: "editor_edit",   editor: view.editor },
                                { sExtends: "editor_remove", editor: view.editor }
                        ]
                }
        } );


    },
});

// app view
new HomeView({el: $('body')});

Backbone.history.start();

} );

