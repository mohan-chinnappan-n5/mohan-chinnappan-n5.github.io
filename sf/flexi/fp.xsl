<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:sf="http://soap.sforce.com/2006/04/metadata"     
>

<xsl:output method="html" />


<!-- Author: mchinnappan -->
<xsl:template match="/">

<html>
<head>
   <link rel="icon" type="image/x-icon" href="https://mohan-chinnappan-n5.github.io/dfv/img/mc_favIcon.ico" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css"
        href="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.12.1/b-2.2.3/b-colvis-2.2.3/b-html5-2.2.3/b-print-2.2.3/datatables.min.css" />

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
    <script type="text/javascript"
        src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.12.1/b-2.2.3/b-colvis-2.2.3/b-html5-2.2.3/b-print-2.2.3/datatables.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.6.1/d3.min.js"
        integrity="sha512-MefNfAGJ/pEy89xLOFs3V6pYPs6AmUhXJrRlydI/9wZuGrqxmrdQ80zKHUcyadAcpH67teDZcBeS6oMJLPtTqw=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

</head>
<body style='min-height: 75rem; padding-top: 3.5rem;'>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
      <a class="navbar-brand" href="#">Flexipage</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home</a>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="#"><xsl:value-of select="sf:DelegateGroup/sf:label"/></a>
          </li>
        </ul>
      </div>
    </nav>


  <div class='container'>

    <p><a href="https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_flexipage.htm">Flexipage</a>: Represents the metadata associated with a Lightning page</p>

    <table style="width:640px"  class="table table-light table-bordered table-striped table-hover">
        <thead>
        <tr>
          <th>masterLabel</th>
          <th>parentFlexiPage</th>
          <th>sobjectType</th>
          <th>type</th>
          <th>template</th>
          <th>description</th>
        </tr>
        </thead>
    
        <tbody>
          <xsl:apply-templates select="sf:FlexiPage" >
          </xsl:apply-templates>
       </tbody>
    </table>


    <h3>flexiPageRegions</h3>
    <p>A Lightning page region can contain up to 100 components.<br/>
        The list of regions of a page.
    
    </p>
    <table style="width:640px"  class="table table-light table-bordered table-striped table-hover">
        <thead>
        <tr>
          <th>name</th>
          <th>mode</th>
          <th>type</th>
        </tr>
        </thead>
    
        <tbody>
          <xsl:apply-templates select="sf:FlexiPage/sf:flexiPageRegions" >
          </xsl:apply-templates>
       </tbody>
    </table>


  
  


</div>

  </body>
  </html>
</xsl:template>

     <!-- templates -->
     <xsl:template match="sf:FlexiPage">
     <xsl:for-each select=".">
     <tr>
         <td><xsl:value-of select="sf:masterLabel"/></td>
         <td><xsl:value-of select="sf:parentFlexiPage"/></td>
         <td><xsl:value-of select="sf:sobjectType"/></td>
         <td><xsl:value-of select="sf:type"/></td>
         <td><xsl:value-of select="sf:template/sf:name"/></td>
         <td><xsl:value-of select="sf:description"/></td>
 
        
     </tr>
    </xsl:for-each>
     </xsl:template>

     
     <xsl:template match="sf:FlexiPage/sf:flexiPageRegions">
      <xsl:for-each select=".">
      <tr>
             <td><xsl:value-of select="sf:name"/></td>
             <td><xsl:value-of select="sf:mode"/></td>
             <td><xsl:value-of select="sf:type"/></td>

             <td>
                <table class="table table-light table-bordered table-striped table-hover">
                  <thead>
                  <tr>
                      <th colspan="2">itemInstances</th>
                  </tr>
                  </thead>
                  <tbody>
                      <xsl:apply-templates select="sf:itemInstances" >
                      </xsl:apply-templates>
                   </tbody>
      
                </table>
      
               </td>

      </tr>
     </xsl:for-each>
    </xsl:template>

    <xsl:template match="sf:DelegateGroup/sf:permissionSets">
        <xsl:for-each select=".">
        <tr>
            <td><xsl:value-of select="."/></td>
        </tr>
       </xsl:for-each>
    </xsl:template>

    <xsl:template match="sf:FlexiPage/sf:flexiPageRegions/sf:itemInstances">
    <tr>
        <td><b>componentName</b>:<xsl:value-of select="sf:componentInstance/sf:componentName"/></td>
        <td><b>identifier</b>:<xsl:value-of select="sf:componentInstance/sf:identifier"/>
        
        
        <table>
            <tr><th>visibilityRule</th></tr>
            <tr>
                <td><xsl:value-of select="sf:componentInstance/sf:visibilityRule/sf:criteria/sf:leftValue"/>
                    <xsl:value-of select="sf:componentInstance/sf:visibilityRule/sf:criteria/sf:operator"/>
                    <xsl:value-of select="sf:componentInstance/sf:visibilityRule/sf:criteria/sf:rightValue"/>
                </td>
            </tr>
        </table>
    </td>
    </tr>
    <xsl:for-each select="sf:componentInstance/sf:componentInstanceProperties">
    <tr>
        <td><xsl:value-of select="sf:name"/></td>
        <td><xsl:value-of select="sf:value"/></td>
    </tr>
   </xsl:for-each>
    </xsl:template>




</xsl:stylesheet>
