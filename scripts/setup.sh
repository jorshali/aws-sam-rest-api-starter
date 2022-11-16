echo Start environment setup.

SCRIPT_PATH=$(dirname -- "$(readlink -f "${BASH_SOURCE}")")

source $SCRIPT_PATH/populate-tables.sh

echo -----------------------------------------
echo Environment setup complete.