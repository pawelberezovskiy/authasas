from pyramid.response import Response
from pyramid.view import view_config
import json

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    MyListing,
    )


class CustomObject(object):
    def __init__(self,item):
        self.id = item.id
        self.address = item.address
        self.port = item.port
        self.ssl = item.ssl
    def __json__(self, request):
        return dict(
            id=self.id,
            address=self.address,
            port=self.port,
            ssl=self.ssl,
            DT_RowId = self.id,
            )

@view_config(route_name='home', renderer='templates/editor.pt')
def my_view(request):
    try:
        one = DBSession.query(MyListing).filter(MyListing.address == 'google.com').first()
    except DBAPIError:
        return Response(conn_err_msg, content_type='text/plain', status_int=500)
    return {'one': one, 'project': 'TestProject'}

@view_config(route_name='api', renderer='json')
def api_view(request):

    if request.POST and request.POST.get('action') == 'edit':

        ids = request.POST.get('id')
        is_ssl = False
        if ids:
            address = request.POST.get('data[address]')
            port = request.POST.get('data[port]')
            ssl = request.POST.get('data[ssl]')
            if ssl == 'true' :is_ssl = True
            server = DBSession.query(MyListing).filter_by(id=ids).update({MyListing.port:port,MyListing.address:address,MyListing.ssl:is_ssl})

        return {'result':True}
    elif request.POST and request.POST.get('action') == 'create':

        is_ssl = False
        new_address = request.POST.get('data[address]')
        new_port = request.POST.get('data[port]')
        new_ssl = request.POST.get('data[ssl]')
        if new_ssl == 'true' :is_ssl = True
        server = MyListing(new_address,new_port,is_ssl)
        DBSession.add(server)

        return {'result':True}
    elif request.POST and request.POST.get('action') == 'remove':
        ids = request.POST.get('id[]')

        if ids:

            server = DBSession.query(MyListing).filter_by(id=ids).one()
            DBSession.delete(server)

        return {'result':True}

    try:
        qw = DBSession.query(MyListing).all()
    except DBAPIError:
        return Response(qw, content_type='text/plain', status_int=500)
    res = []
    for item in qw:
       res.append( CustomObject(item) )

    return {'data': res ,'result':True}


conn_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to run the "initialize_TestProject_db" script
    to initialize your database tables.  Check your virtual 
    environment's "bin" directory for this script and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""

