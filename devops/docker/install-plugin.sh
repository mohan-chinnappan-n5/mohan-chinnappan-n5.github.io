 RUN cat <<EOF >/tmp/install_plugins.sh
    echo 'y' | sfdx plugins:install sfdmu@${SF_DMU_VER}}
    echo 'y' | sfdx plugins:install sfpowerkit@${SF_POWERKIT_VER}}
    echo 'y' | sfdx plugins:install @dxatscale/sfpowerscripts@${SF_POWERSCRIPTS_VER}}
    echo 'y' | sfdx plugins:install sfdx-browserforce-plugin@${SF_BROWSERFORCE_VER}
EOF
