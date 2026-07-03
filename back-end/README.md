## migration
php artisan migrate

## ajouter role
php artisan db:seed



base de donne

USER
* id
* name
* email
* password
* phone
* created_at
* updated_at
// Table principale contenant tous les utilisateurs
ROLE
* id
* name
* description
// Définit les rôles (admin, client, traiteur)
USER_ROLE
* user_id
* role_id
* assigned_at
// Table pivot pour gérer plusieurs rôles
CATERER
* id* user_id
* company_name
* description
* location
* address
* verified
* rating
* created_at
* updated_at
// Profil professionnel du traiteur
CATEGORY
* id
* name
* type
// Type de service (cuisine, événement)
SERVICE
* id
* caterer_id
* category_id
* title
* description
* price
* event_type
* created_at
* updated_at
// Offre proposée par le traiteurMEDIA
* id
* entity_type
* entity_id
* url
* type
* position
* created_at
// Images ou vidéos associées à un service/profil
PAST_EVENT
* id
* caterer_id
* title
* description
* event_date
* guests_number
* is_public
* created_at
// Historique des événements réalisés
REVIEW
* id
* user_id
* caterer_id
* service_id* past_event_id
* rating
* comment
* created_at
// Avis client (note + commentaire)
AVAILABILITY
* id
* caterer_id
* start_date
* end_date
* is_blocked
* reason
// Gestion du calendrier du traiteur
EVENT_REQUEST
* id
* client_id
* caterer_id
* event_type
* event_date
* guests_number
* budget
* message
* status
* created_at
// Demande envoyée par le clientQUOTE
* id
* event_request_id
* caterer_id
* proposed_price
* message
* status
* sent_at
// Proposition commerciale du traiteur
MESSAGE
* id
* sender_id
* receiver_id
* event_request_id
* quote_id
* message
* read_status
* created_at
// Système de messagerie interne
SUBSCRIPTION
* id
* caterer_id
* plan
* price
* start_date* end_date
* status
// Abonnement du traiteur à la plateforme
PAYMENT
* id
* user_id
* subscription_id
* quote_id
* amount
* status
* transaction_id
* created_at
// Paiements (abonnement ou événement)


BOOKING
* id
* quote_id
* event_request_id
* client_id
* caterer_id
* event_date
* start_time (optionnel)
* end_time (optionnel)
* status
    - confirmed
    - completed
    - cancelled
    - postponed
* total_price
* created_at
* updated_at