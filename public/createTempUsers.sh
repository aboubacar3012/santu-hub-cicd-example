#!/bin/bash
# ==============================================================================
# SCRIPT DE CRÉATION D'UTILISATEURS TEMPORAIRES : Création d'utilisateurs temporaires
#
# Ce script crée des utilisateurs temporaires avec une durée de vie de 2 heures.
# Les utilisateurs ont accès uniquement au root et au groupe docker.
#
# FONCTIONNALITÉS PRINCIPALES:
# ============================
# 1. Création des 15 utilisateurs DevOps avec mots de passe spécifiques
# 2. Ajout au groupe docker
# 3. Programmation de la suppression automatique après 2 heures
# 4. Vérification des prérequis (root, groupe docker, at)
# 5. Affichage des informations de connexion
#
# CONDITIONS ET COMPORTEMENTS:
# ============================
# • PRÉREQUIS OBLIGATOIRES:
#   - Script exécuté en root (sudo ou root)
#   - Groupe docker existant
#   - Commande 'at' installée pour la programmation
#
# • UTILISATEURS CRÉÉS:
#   - 15 utilisateurs DevOps (devops-user-01 à devops-user-15)
#   - Shell par défaut : /bin/bash
#   - Groupe secondaire : docker
#   - Durée de vie : 2 heures
#   - Mots de passe prédéfinis
#
# • GESTION DES ERREURS:
#   - Arrêt immédiat en cas d'erreur critique (set -euo)
#   - Messages d'erreur clairs avec instructions
#
# PRÉREQUIS:
# ==========
# • Script exécuté en root (sudo ou root)
# • Groupe docker existant (Docker installé)
# • Commande 'at' installée (pour la programmation)
#
# Usage:
#   sudo ./createTempUsers.sh  # Crée les 15 utilisateurs DevOps
#
# Exemple:
#   sudo ./createTempUsers.sh  # Crée devops-user-01 à devops-user-15
#
# Auteur : Inspiré de deploy.sh
# ==============================================================================

set -euo # Exit immediately on error, treat unset variables as error
set -o pipefail # Return pipeline status (status of last command to exit with non-zero)

DATE=$(date +"%Y%m%d-%H%M%S")

# ==============================================================================
# SECTION 1: COULEURS ET FONCTIONS DE LOGGING
# ==============================================================================

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Fonction pour logger avec timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Fonction pour logger les sections
log_section() {
    echo ""
    echo "============================================================"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "============================================================"
}

# Fonction pour afficher les messages
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    log "INFO: $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS: $1"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING: $1"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    log "ERROR: $1"
    exit 1
}

# ==============================================================================
# SECTION 2: VÉRIFICATIONS PRÉALABLES
# ==============================================================================

# Vérifier que le script est exécuté en root
if [ "$EUID" -ne 0 ]; then 
    error "Ce script doit être exécuté avec sudo ou en tant que root"
fi

# Vérifier que le groupe docker existe
if ! getent group docker > /dev/null 2>&1; then
    error "Le groupe 'docker' n'existe pas. Veuillez installer Docker."
fi

# Vérifier que la commande 'at' est installée
if ! command -v at &> /dev/null; then
    error "La commande 'at' n'est pas installée. Installez-la avec : apt install at"
fi

# ==============================================================================
# SECTION 3: CONFIGURATION SSH
# ==============================================================================

SSH_PUBLIC_KEY_URL="https://raw.githubusercontent.com/aboubacar3012/santu-hub-cicd-example/main/public/sshPublicKey.txt"

# ==============================================================================
# SECTION 4: CRÉATION DES UTILISATEURS DEVOPS
# ==============================================================================

create_devops_users() {
    log_section "Création des utilisateurs DevOps temporaires"
    
    # Définir les utilisateurs et leurs mots de passe
    declare -A DEVOPS_USERS=(
        ["devops-user-01"]="DevOps#7M92"
        ["devops-user-02"]="DevOps@4Q81"
        ["devops-user-03"]="DevOps!9K36"
        ["devops-user-04"]="DevOps\$2R75"
        ["devops-user-05"]="DevOps%8A64"
        ["devops-user-06"]="DevOps&5Z19"
        ["devops-user-07"]="DevOps#3J88"
        ["devops-user-08"]="DevOps@6T42"
        ["devops-user-09"]="DevOps!1W97"
        ["devops-user-10"]="DevOps\$9H24"
        ["devops-user-11"]="DevOps%4P63"
        ["devops-user-12"]="DevOps&7C58"
        ["devops-user-13"]="DevOps#2L91"
        ["devops-user-14"]="DevOps@8X46"
        ["devops-user-15"]="DevOps!5B73"
    )
    
    for USERNAME in "${!DEVOPS_USERS[@]}"; do
        PASSWORD="${DEVOPS_USERS[$USERNAME]}"
        create_user_with_password "$USERNAME" "$PASSWORD"
        USERS_CREATED+=("$USERNAME:$PASSWORD")
    done
    
    return 0
}

# ==============================================================================
# SECTION 4.5: FONCTION POUR CRÉER UN UTILISATEUR AVEC MOT DE PASSE
# ==============================================================================

create_user_with_password() {
    local USERNAME="$1"
    local PASSWORD="$2"
    
    info "Création de l'utilisateur temporaire : $USERNAME"
    
    # Vérifier si l'utilisateur existe déjà et le supprimer
    if id "$USERNAME" > /dev/null 2>&1; then
        warning "L'utilisateur $USERNAME existe déjà. Suppression en cours..."
        
        # Annuler les tâches programmées pour cet utilisateur
        atq | grep -i "userdel.*$USERNAME" | awk '{print $1}' | xargs -r atrm 2>/dev/null || true
        
        # Supprimer l'utilisateur et son répertoire home
        if userdel -r "$USERNAME" 2>/dev/null; then
            success "Utilisateur $USERNAME supprimé"
        else
            warning "Échec de la suppression de $USERNAME, tentative de suppression forcée..."
            # Tentative de suppression forcée
            killall -u "$USERNAME" 2>/dev/null || true
            sleep 1
            userdel -rf "$USERNAME" 2>/dev/null || true
        fi
    fi
    
    # Créer l'utilisateur
    if useradd -m -s /bin/bash "$USERNAME"; then
        success "Utilisateur $USERNAME créé"
    else
        error "Échec de la création de l'utilisateur $USERNAME"
    fi
    
    # Définir le mot de passe
    echo "$USERNAME:$PASSWORD" | chpasswd
    
    # Ajouter au groupe docker
    if usermod -aG docker "$USERNAME"; then
        success "Utilisateur $USERNAME ajouté au groupe docker"
    else
        error "Échec de l'ajout de $USERNAME au groupe docker"
    fi
    
    # Configurer SSH
    USER_HOME=$(eval echo "~$USERNAME")
    SSH_DIR="$USER_HOME/.ssh"
    AUTHORIZED_KEYS="$SSH_DIR/authorized_keys"
    
    # Créer le répertoire .ssh
    mkdir -p "$SSH_DIR"
    chmod 700 "$SSH_DIR"
    chown "$USERNAME:$USERNAME" "$SSH_DIR"
    
    # Récupérer et ajouter la clé publique
    if curl -fsSL "$SSH_PUBLIC_KEY_URL" >> "$AUTHORIZED_KEYS"; then
        success "Clé SSH publique ajoutée pour $USERNAME"
    else
        error "Échec de la récupération de la clé SSH pour $USERNAME"
    fi
    
    chmod 600 "$AUTHORIZED_KEYS"
    chown "$USERNAME:$USERNAME" "$AUTHORIZED_KEYS"
    
    # Programmer la suppression après 2 heures
    if echo "userdel -r $USERNAME" | at now + 2 hours > /dev/null 2>&1; then
        success "Suppression programmée pour $USERNAME dans 2 heures"
    else
        warning "Échec de la programmation de la suppression pour $USERNAME"
    fi
    
    echo ""
}

# ==============================================================================
# SECTION 5: EXÉCUTION PRINCIPALE
# ==============================================================================

# Initialiser le tableau des utilisateurs créés
USERS_CREATED=()

# Créer les utilisateurs DevOps avec leurs mots de passe spécifiques
create_devops_users

# ==============================================================================
# SECTION 6: RÉSUMÉ FINAL
# ==============================================================================

log_section "Utilisateurs temporaires créés"
echo ""
success "Création terminée avec succès!"
echo ""

info "Résumé des utilisateurs créés:"
for USER_INFO in "${USERS_CREATED[@]}"; do
    USERNAME=$(echo "$USER_INFO" | cut -d: -f1)
    PASSWORD=$(echo "$USER_INFO" | cut -d: -f2)
    echo "  • Utilisateur: $USERNAME"
    echo "    Mot de passe: $PASSWORD"
    echo "    Groupes: docker"
    echo "    Clé SSH: configurée"
    echo "    Expiration: 2 heures"
    echo ""
done

info "Commandes utiles:"
echo "  • Lister les utilisateurs DevOps:"
echo "    cat /etc/passwd | grep devops-user"
echo ""
echo "  • Vérifier les tâches programmées:"
echo "    atq"
echo ""
echo "  • Supprimer manuellement un utilisateur:"
echo "    userdel -r devops-user-XX"
echo ""

warning "Les utilisateurs seront automatiquement supprimés après 2 heures."
warning "Conservez les mots de passe en lieu sûr!"

log "Création terminée avec succès"
log "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""



#### USAGE EXAMPLE ####
# Télécharger le script:
# curl -fsSL -o createTempUsers.sh https://raw.githubusercontent.com/aboubacar3012/santu-hub-cicd-example/main/public/createTempUsers.sh
# chmod +x createTempUsers.sh
#
# Créer les 15 utilisateurs DevOps:
# sudo ./createTempUsers.sh
