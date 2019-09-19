sudo pacman -Syy
sudo pacman -S --noconfirm git make gcc inotify-tools
git clone https://bitbucket.org/sivann/restarter.git /home/vagrant/restarter
cd /home/vagrant/restarter
make
sudo mv ./restarter /usr/local/bin
cd ~
echo "Installing deno in $(pwd)"
wget https://deno.land/x/install/install.sh
sh install.sh
# /vagrant/scripts/watch-changes.sh
