<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        <xsl:template match="/">
    <ul>
            <xsl:for-each select="games/game">
            <li>
                <xsl:value-of select="name" />
                <xsl:value-of select="developer" />
           </li>
            </xsl:for-each>
    </ul>
    </xsl:template>
</xsl:stylesheet>