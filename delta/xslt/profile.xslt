<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
            <head>
                <link rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
                    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                    crossorigin="anonymous"></link>
            </head>
            <body style='min-height: 75rem; padding-top: 3.5rem;'>
                <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
                    <a class="navbar-brand" href="#">Profile</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                      <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                      <ul class="navbar-nav">
                        <li class="nav-item active">
                          <a class="nav-link" href="#">Home</a>
                        </li>
                      </ul>
                    </div>
                  </nav>

                <ul class='list-group' style="width:640px;">
                <li class='list-group-item'><a href="#classAccesses">applicationVisibilities</a></li>
                 <li class='list-group-item'><a href="#classAccesses">classAccesses</a></li>
                <li class='list-group-item'><a href="#layoutAssignments">layoutAssignments</a></li>
                 <li class='list-group-item'><a href="#fieldPermissions">fieldPermissions</a></li>
                <li class='list-group-item'><a href="#objectPermissions">objectPermissions</a></li>
                <li class='list-group-item'><a href="#userPermissions">userPermissions</a></li>
                </ul>


                <xsl:apply-templates select="Profile"/>
            </body>
        </html>
    </xsl:template>


    <xsl:template match="Profile">
        <a name="applicationVisibilities"></a>
    
        <h3>applicationVisibilities</h3>
        <table style='width:640px;' class="table table-light table-bordered table-striped table-hover">
            <tr>
                <th>application</th>
                <th>default</th>
                <th>visible</th>
            </tr>
            <xsl:for-each  select="applicationVisibilities">
                <tr>
                    <td>
                        <xsl:value-of select="application" />
                    </td>

                    <td>
                        <xsl:value-of select="default" />
                    </td>

                    <td>
                        <xsl:value-of select="visible" />
                    </td>
                     
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>


    <xsl:template match="Profile">
        <a name="classAccesses"></a>
    
        <h3>classAccesses</h3>
        <table style='width:640px;' class="table table-light table-bordered table-striped table-hover">
            <tr>
                <th>apexClass</th>
                <th>enabled</th>
            </tr>
            <xsl:for-each  select="classAccesses">
                <tr>
                    <td>
                        <xsl:value-of select="apexClass" />
                    </td>

                    <td>
                        <xsl:value-of select="enabled" />
                    </td>
                     
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>

    <xsl:template match="Profile">
    <a name="layoutAssignments"></a>

    <h3>layoutAssignments</h3>
    <table style='width:640px;' class="table table-light table-bordered table-striped table-hover">
        <tr>
            <th>layout</th>
        </tr>
        <xsl:for-each  select="layoutAssignments">
            <tr>
                <td>
                    <xsl:value-of select="layout" />
                </td>
                 
            </tr>
        </xsl:for-each>
    </table>
</xsl:template>
    <xsl:template match="Profile">
        <a name="fieldPermissions"></a>

        <h3>fieldPermissions</h3>   

        
        <table style='width:640px;' class="table table-light table-bordered table-striped table-hover">
            <tr>
                <th>field</th>
                <th>readable</th>
                <th>editable</th>
            
    
            </tr>
            <xsl:for-each  select="fieldPermissions">
                <tr>
                    <td>
                        <xsl:value-of select="field" />
                    </td>
                    <td>
                        <xsl:value-of select="readable" />
                    </td>
                    <td>
                        <xsl:value-of select="editable" />
                    </td>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>
    

    <xsl:template match="Profile">
        <a name="objectPermissions"></a>
        <h3>objectPermissions</h3>

        <table style='width:640px;' class="table table-light table-bordered table-striped table-hover">
            <tr>
                <th>object</th>
                <th>allowCreate</th>
                <th>allowDelete</th>
                <th>allowEdit</th>
                <th>allowRead</th>
                <th>viewAllRecords</th>
                <th>modifyAllRecords</th>
            

            </tr>
            <xsl:for-each  select="objectPermissions">
                <tr>
                    <td>
                        <xsl:value-of select="object" />
                    </td>
                    <td>
                        <xsl:value-of select="allowCreate" />
                    </td>
                    <td>
                        <xsl:value-of select="allowDelete" />
                    </td>
                    <td>
                        <xsl:value-of select="allowEdit" />
                    </td>
                    <td>
                        <xsl:value-of select="allowRead" />
                    </td>
                    <td>
                        <xsl:value-of select="viewAllRecords" />
                    </td>
                    <td>
                        <xsl:value-of select="modifyAllRecords" />
                    </td>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>

    <xsl:template match="Profile">
        <a name="userPermissions"></a>

        <h3>userPermissions</h3>
 

    <table style='width:640px;' class="table table-light table-bordered table-striped table-hover">

        <tr>
            <th>name</th>
            <th>enabled</th>
        </tr>
        <xsl:for-each  select="userPermissions">
            <tr>
                <td>
                    <xsl:value-of select="name" />
                </td>
                <td>
                    <xsl:value-of select="enabled" />
                </td>
                    <xsl:value-of select="modifyAllRecords" />
                </td>
            </tr>
        </xsl:for-each>
    </table>
</xsl:template>

</xsl:stylesheet>