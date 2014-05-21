from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
    Boolean,
    )

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class MyListing(Base):
    __tablename__ = 'models'
    id = Column(Integer, primary_key=True)
    address = Column(Text)
    port = Column(Integer)
    ssl = Column(Boolean)

    def __init__(self,address,port,ssl):
        self.address = address
        self.port = port
        self.ssl = ssl

Index('my_index', MyListing.address, unique=True, mysql_length=255)
