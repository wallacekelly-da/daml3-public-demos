import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
    namespace Schemas {
        /**
         * AllocatePartyRequest
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(identity_provider_id)``
         */
        export interface AllocatePartyRequest {
            /**
             * A hint to the participant which party ID to allocate. It can be
             * ignored.
             * Must be a valid PartyIdString (as described in ``value.proto``).
             * Optional
             */
            partyIdHint: string;
            /**
             * Formerly "display_name"
             * Participant-local metadata to be stored in the ``PartyDetails`` of this newly allocated party.
             * Optional
             */
            localMetadata?: /**
             * ObjectMeta
             * Represents metadata corresponding to a participant resource (e.g. a participant user or participant local information about a party).
             *
             * Based on ``ObjectMeta`` meta used in Kubernetes API.
             * See https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/generated.proto#L640
             */
            ObjectMeta;
            /**
             * The id of the ``Identity Provider``
             * Optional, if not set, assume the party is managed by the default identity provider or party is not hosted by the participant.
             */
            identityProviderId: string;
            /**
             * The synchronizer, on which the party should be allocated.
             * For backwards compatibility, this field may be omitted, if the participant is connected to only one synchronizer.
             * Otherwise a synchronizer must be specified.
             * Optional
             */
            synchronizerId: string;
            /**
             * The user who will get the act_as rights to the newly allocated party.
             * If set to an empty string (the default), no user will get rights to the party.
             * Optional
             */
            userId: string;
        }
        /**
         * AllocatePartyResponse
         */
        export interface AllocatePartyResponse {
            /**
             *
             */
            partyDetails?: /* PartyDetails */ PartyDetails;
        }
        /**
         * ArchivedEvent
         * Records that a contract has been archived, and choices may no longer be exercised on it.
         */
        export interface ArchivedEvent {
            /**
             * The offset of origin.
             * Offsets are managed by the participant nodes.
             * Transactions can thus NOT be assumed to have the same offsets on different participant nodes.
             * Required, it is a valid absolute offset (positive integer)
             */
            offset: number; // int64
            /**
             * The position of this event in the originating transaction or reassignment.
             * Node IDs are not necessarily equal across participants,
             * as these may see different projections/parts of transactions.
             * Required, must be valid node ID (non-negative integer)
             */
            nodeId: number; // int32
            /**
             * The ID of the archived contract.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            contractId: string;
            /**
             * Identifies the template that defines the choice that archived the contract.
             * This template's package-id may differ from the target contract's package-id
             * if the target contract has been upgraded or downgraded.
             *
             * The identifier uses the package-id reference format.
             *
             * Required
             */
            templateId: string;
            /**
             * The parties that are notified of this event. For an ``ArchivedEvent``,
             * these are the intersection of the stakeholders of the contract in
             * question and the parties specified in the ``TransactionFilter``. The
             * stakeholders are the union of the signatories and the observers of
             * the contract.
             * Each one of its elements must be a valid PartyIdString (as described
             * in ``value.proto``).
             * Required
             */
            witnessParties?: string[];
            /**
             * The package name of the contract.
             * Required
             */
            packageName: string;
            /**
             * The interfaces implemented by the target template that have been
             * matched from the interface filter query.
             * Populated only in case interface filters with include_interface_view set.
             *
             * If defined, the identifier uses the package-id reference format.
             *
             * Optional
             */
            implementedInterfaces?: string[];
        }
        /**
         * AssignCommand
         * Assign a contract
         */
        export interface AssignCommand {
            value: /**
             * AssignCommand
             * Assign a contract
             */
            AssignCommand1;
        }
        /**
         * AssignCommand
         * Assign a contract
         */
        export interface AssignCommand1 {
            /**
             * The ID from the unassigned event to be completed by this assignment.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            reassignmentId: string;
            /**
             * The ID of the source synchronizer
             * Must be a valid synchronizer id
             * Required
             */
            source: string;
            /**
             * The ID of the target synchronizer
             * Must be a valid synchronizer id
             * Required
             */
            target: string;
        }
        /**
         * CanActAs
         */
        export interface CanActAs {
            value: /* CanActAs */ CanActAs1;
        }
        /**
         * CanActAs
         */
        export interface CanActAs1 {
            party: string;
        }
        /**
         * CanReadAs
         */
        export interface CanReadAs {
            value: /* CanReadAs */ CanReadAs1;
        }
        /**
         * CanReadAs
         */
        export interface CanReadAs1 {
            party: string;
        }
        /**
         * CanReadAsAnyParty
         */
        export interface CanReadAsAnyParty {
            value: /* CanReadAsAnyParty */ CanReadAsAnyParty1;
        }
        /**
         * CanReadAsAnyParty
         */
        export interface CanReadAsAnyParty1 {
        }
        /**
         * Command
         * A command can either create a new contract or exercise a choice on an existing contract.
         */
        export type Command = /**
         * Command
         * A command can either create a new contract or exercise a choice on an existing contract.
         */
        {
            CreateAndExerciseCommand: /**
             * CreateAndExerciseCommand
             * Create a contract and exercise a choice on it in the same transaction.
             */
            CreateAndExerciseCommand;
        } | {
            CreateCommand: /**
             * CreateCommand
             * Create a new contract instance based on a template.
             */
            CreateCommand;
        } | {
            ExerciseByKeyCommand: /**
             * ExerciseByKeyCommand
             * Exercise a choice on an existing contract specified by its key.
             */
            ExerciseByKeyCommand;
        } | {
            ExerciseCommand: /**
             * ExerciseCommand
             * Exercise a choice on an existing contract.
             */
            ExerciseCommand;
        };
        /**
         * Command
         * A command can either create a new contract or exercise a choice on an existing contract.
         */
        export type Command1 = /**
         * Command
         * A command can either create a new contract or exercise a choice on an existing contract.
         */
        {
            AssignCommand: /**
             * AssignCommand
             * Assign a contract
             */
            AssignCommand;
        } | {
            Empty: /* Empty */ Empty2;
        } | {
            UnassignCommand: /**
             * UnassignCommand
             * Unassign a contract
             */
            UnassignCommand;
        };
        /**
         * Completion
         * A completion represents the status of a submitted command on the ledger: it can be successful or failed.
         */
        export interface Completion {
            value: /**
             * Completion
             * A completion represents the status of a submitted command on the ledger: it can be successful or failed.
             */
            Completion1;
        }
        /**
         * Completion
         * A completion represents the status of a submitted command on the ledger: it can be successful or failed.
         */
        export interface Completion1 {
            /**
             * The ID of the succeeded or failed command.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            commandId: string;
            /**
             * Identifies the exact type of the error.
             * It uses the same format of conveying error details as it is used for the RPC responses of the APIs.
             * Optional
             */
            status?: /* JsStatus */ JsStatus;
            /**
             * The update_id of the transaction or reassignment that resulted from the command with command_id.
             * Only set for successfully executed commands.
             * Must be a valid LedgerString (as described in ``value.proto``).
             */
            updateId: string;
            /**
             * The user-id that was used for the submission, as described in ``commands.proto``.
             * Must be a valid UserIdString (as described in ``value.proto``).
             * Optional for historic completions where this data is not available.
             */
            userId: string;
            /**
             * The set of parties on whose behalf the commands were executed.
             * Contains the ``act_as`` parties from ``commands.proto``
             * filtered to the requesting parties in CompletionStreamRequest.
             * The order of the parties need not be the same as in the submission.
             * Each element must be a valid PartyIdString (as described in ``value.proto``).
             * Optional for historic completions where this data is not available.
             */
            actAs?: string[];
            /**
             * The submission ID this completion refers to, as described in ``commands.proto``.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            submissionId: string;
            deduplicationPeriod: /**
             * DeduplicationPeriod
             * The actual deduplication window used for the submission, which is derived from
             * ``Commands.deduplication_period``. The ledger may convert the deduplication period into other
             * descriptions and extend the period in implementation-specified ways.
             *
             * Used to audit the deduplication guarantee described in ``commands.proto``.
             *
             * Optional; the deduplication guarantee applies even if the completion omits this field.
             */
            DeduplicationPeriod1;
            /**
             * Optional; ledger API trace context
             *
             * The trace context transported in this message corresponds to the trace context supplied
             * by the client application in a HTTP2 header of the original command submission.
             * We typically use a header to transfer this type of information. Here we use message
             * body, because it is used in gRPC streams which do not support per message headers.
             * This field will be populated with the trace context contained in the original submission.
             * If that was not provided, a unique ledger-api-server generated trace context will be used
             * instead.
             */
            traceContext?: /* TraceContext */ TraceContext;
            /**
             * May be used in a subsequent CompletionStreamRequest to resume the consumption of this stream at a later time.
             * Required, must be a valid absolute offset (positive integer).
             */
            offset: number; // int64
            /**
             * The synchronizer along with its record time.
             * The synchronizer id provided, in case of
             *
             * - successful/failed transactions: identifies the synchronizer of the transaction
             * - for successful/failed unassign commands: identifies the source synchronizer
             * - for successful/failed assign commands: identifies the target synchronizer
             *
             * Required
             */
            synchronizerTime?: /* SynchronizerTime */ SynchronizerTime;
        }
        /**
         * CompletionResponse
         */
        export type CompletionResponse = /* CompletionResponse */ {
            Completion: /**
             * Completion
             * A completion represents the status of a submitted command on the ledger: it can be successful or failed.
             */
            Completion;
        } | {
            Empty: /* Empty */ Empty4;
        } | {
            OffsetCheckpoint: /**
             * OffsetCheckpoint
             * OffsetCheckpoints may be used to:
             *
             * - detect time out of commands.
             * - provide an offset which can be used to restart consumption.
             */
            OffsetCheckpoint;
        };
        /**
         * CompletionStreamRequest
         */
        export interface CompletionStreamRequest {
            /**
             * Only completions of commands submitted with the same user_id will be visible in the stream.
             * Must be a valid UserIdString (as described in ``value.proto``).
             * Required unless authentication is used with a user token.
             * In that case, the token's user-id will be used for the request's user_id.
             */
            userId: string;
            /**
             * Non-empty list of parties whose data should be included.
             * The stream shows only completions of commands for which at least one of the ``act_as`` parties is in the given set of parties.
             * Must be a valid PartyIdString (as described in ``value.proto``).
             * Required
             */
            parties?: string[];
            /**
             * This optional field indicates the minimum offset for completions. This can be used to resume an earlier completion stream.
             * If not set the ledger uses the ledger begin offset instead.
             * If specified, it must be a valid absolute offset (positive integer) or zero (ledger begin offset).
             * If the ledger has been pruned, this parameter must be specified and greater than the pruning offset.
             */
            beginExclusive: number; // int64
        }
        /**
         * CompletionStreamResponse
         */
        export interface CompletionStreamResponse {
            completionResponse: /* CompletionResponse */ CompletionResponse;
        }
        /**
         * ConnectedSynchronizer
         */
        export interface ConnectedSynchronizer {
            synchronizerAlias: string;
            synchronizerId: string;
            permission: string;
        }
        /**
         * CreateAndExerciseCommand
         * Create a contract and exercise a choice on it in the same transaction.
         */
        export interface CreateAndExerciseCommand {
            /**
             * The template of the contract the client wants to create.
             * Both package-name and package-id reference identifier formats for the template-id are supported.
             * Note: The package-id reference identifier format is deprecated. We plan to end support for this format in version 3.4.
             *
             * Required
             */
            templateId: string;
            /**
             * The arguments required for creating a contract from this template.
             * Required
             */
            createArguments: any;
            /**
             * The name of the choice the client wants to exercise.
             * Must be a valid NameString (as described in ``value.proto``).
             * Required
             */
            choice: string;
            /**
             * The argument for this choice.
             * Required
             */
            choiceArgument: any;
        }
        /**
         * CreateCommand
         * Create a new contract instance based on a template.
         */
        export interface CreateCommand {
            /**
             * The template of contract the client wants to create.
             * Both package-name and package-id reference identifier formats for the template-id are supported.
             * Note: The package-id reference identifier format is deprecated. We plan to end support for this format in version 3.4.
             *
             * Required
             */
            templateId: string;
            /**
             * The arguments required for creating a contract from this template.
             * Required
             */
            createArguments: any;
        }
        /**
         * CreateIdentityProviderConfigRequest
         */
        export interface CreateIdentityProviderConfigRequest {
            /**
             * Required
             */
            identityProviderConfig?: /* IdentityProviderConfig */ IdentityProviderConfig;
        }
        /**
         * CreateIdentityProviderConfigResponse
         */
        export interface CreateIdentityProviderConfigResponse {
            /**
             *
             */
            identityProviderConfig?: /* IdentityProviderConfig */ IdentityProviderConfig;
        }
        /**
         * CreateUserRequest
         *  RPC requests and responses
         * ///////////////////////////
         *  Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(user.identity_provider_id)``
         */
        export interface CreateUserRequest {
            /**
             * The user to create.
             * Required
             */
            user?: /**
             * User
             *  Users and rights
             * /////////////////
             *  Users are used to dynamically manage the rights given to Daml applications.
             *  They are stored and managed per participant node.
             */
            User;
            /**
             * The rights to be assigned to the user upon creation,
             * which SHOULD include appropriate rights for the ``user.primary_party``.
             * Optional
             */
            rights?: /**
             * Right
             * A right granted to a user.
             */
            Right[];
        }
        /**
         * CreateUserResponse
         */
        export interface CreateUserResponse {
            /**
             * Created user.
             */
            user?: /**
             * User
             *  Users and rights
             * /////////////////
             *  Users are used to dynamically manage the rights given to Daml applications.
             *  They are stored and managed per participant node.
             */
            User;
        }
        /**
         * CreatedEvent
         * Records that a contract has been created, and choices may now be exercised on it.
         */
        export interface CreatedEvent {
            /**
             * The offset of origin, which has contextual meaning, please see description at messages that include a CreatedEvent.
             * Offsets are managed by the participant nodes.
             * Transactions can thus NOT be assumed to have the same offsets on different participant nodes.
             * Required, it is a valid absolute offset (positive integer)
             */
            offset: number; // int64
            /**
             * The position of this event in the originating transaction or reassignment.
             * The origin has contextual meaning, please see description at messages that include a CreatedEvent.
             * Node IDs are not necessarily equal across participants,
             * as these may see different projections/parts of transactions.
             * Required, must be valid node ID (non-negative integer)
             */
            nodeId: number; // int32
            /**
             * The ID of the created contract.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            contractId: string;
            /**
             * The template of the created contract.
             * The identifier uses the package-id reference format.
             *
             * Required
             */
            templateId: string;
            /**
             * The key of the created contract.
             * This will be set if and only if ``template_id`` defines a contract key.
             * Optional
             */
            contractKey?: any;
            createArgument?: any;
            /**
             * Opaque representation of contract create event payload intended for forwarding
             * to an API server as a contract disclosed as part of a command
             * submission.
             * Optional
             */
            createdEventBlob: string;
            /**
             * Interface views specified in the transaction filter.
             * Includes an ``InterfaceView`` for each interface for which there is a ``InterfaceFilter`` with
             *
             * - its party in the ``witness_parties`` of this event,
             * - and which is implemented by the template of this event,
             * - and which has ``include_interface_view`` set.
             *
             * Optional
             */
            interfaceViews?: /**
             * JsInterfaceView
             * View of a create event matched by an interface filter.
             */
            JsInterfaceView[];
            /**
             * The parties that are notified of this event. When a ``CreatedEvent``
             * is returned as part of a transaction tree or ledger-effects transaction, this will include all
             * the parties specified in the ``TransactionFilter`` that are witnesses  of the event
             * (the stakeholders of the contract and all informees of all the ancestors
             * of this create action that this participant knows about).
             * If served as part of a ACS delta transaction those will
             * be limited to all parties specified in the ``TransactionFilter`` that
             * are stakeholders of the contract (i.e. either signatories or observers).
             * If the ``CreatedEvent`` is returned as part of an AssignedEvent,
             * ActiveContract or IncompleteUnassigned (so the event is related to
             * an assignment or unassignment): this will include all parties of the
             * ``TransactionFilter`` that are stakeholders of the contract.
             *
             * The behavior of reading create events visible to parties not hosted
             * on the participant node serving the Ledger API is undefined. Concretely,
             * there is neither a guarantee that the participant node will serve all their
             * create events on the ACS stream, nor is there a guarantee that matching archive
             * events are delivered for such create events.
             *
             * For most clients this is not a problem, as they only read events for parties
             * that are hosted on the participant node. If you need to read events
             * for parties that may not be hosted at all times on the participant node,
             * subscribe to the ``TopologyEvent``s for that party by setting a corresponding
             * ``UpdateFormat``.  Using these events, query the ACS as-of an offset where the
             * party is hosted on the participant node, and ignore create events at offsets
             * where the party is not hosted on the participant node.
             * Required
             */
            witnessParties?: string[];
            /**
             * The signatories for this contract as specified by the template.
             * Required
             */
            signatories?: string[];
            /**
             * The observers for this contract as specified explicitly by the template or implicitly as choice controllers.
             * This field never contains parties that are signatories.
             * Required
             */
            observers?: string[];
            /**
             * Ledger effective time of the transaction that created the contract.
             * Required
             */
            createdAt: string;
            /**
             * The package name of the created contract.
             * Required
             */
            packageName: string;
        }
        /**
         * CreatedTreeEvent
         */
        export interface CreatedTreeEvent {
            value: /**
             * CreatedEvent
             * Records that a contract has been created, and choices may now be exercised on it.
             */
            CreatedEvent;
        }
        /**
         * CumulativeFilter
         * A filter that matches all contracts that are either an instance of one of
         * the ``template_filters`` or that match one of the ``interface_filters``.
         */
        export interface CumulativeFilter {
            identifierFilter: /* IdentifierFilter */ IdentifierFilter;
        }
        /**
         * DeduplicationDuration
         */
        export interface DeduplicationDuration {
            value: /* Duration */ Duration;
        }
        /**
         * DeduplicationDuration
         */
        export interface DeduplicationDuration1 {
            value: /* Duration */ Duration;
        }
        /**
         * DeduplicationDuration
         */
        export interface DeduplicationDuration2 {
            value: /* Duration */ Duration;
        }
        /**
         * DeduplicationOffset
         */
        export interface DeduplicationOffset {
            value: number; // int64
        }
        /**
         * DeduplicationOffset
         */
        export interface DeduplicationOffset1 {
            value: number; // int64
        }
        /**
         * DeduplicationOffset
         */
        export interface DeduplicationOffset2 {
            value: number; // int64
        }
        /**
         * DeduplicationPeriod
         * Specifies the deduplication period for the change ID.
         * If omitted, the participant will assume the configured maximum deduplication time.
         */
        export type DeduplicationPeriod = /**
         * DeduplicationPeriod
         * Specifies the deduplication period for the change ID.
         * If omitted, the participant will assume the configured maximum deduplication time.
         */
        {
            DeduplicationDuration: /* DeduplicationDuration */ DeduplicationDuration;
        } | {
            DeduplicationOffset: /* DeduplicationOffset */ DeduplicationOffset;
        } | {
            Empty: /* Empty */ Empty;
        };
        /**
         * DeduplicationPeriod
         * The actual deduplication window used for the submission, which is derived from
         * ``Commands.deduplication_period``. The ledger may convert the deduplication period into other
         * descriptions and extend the period in implementation-specified ways.
         *
         * Used to audit the deduplication guarantee described in ``commands.proto``.
         *
         * Optional; the deduplication guarantee applies even if the completion omits this field.
         */
        export type DeduplicationPeriod1 = /**
         * DeduplicationPeriod
         * The actual deduplication window used for the submission, which is derived from
         * ``Commands.deduplication_period``. The ledger may convert the deduplication period into other
         * descriptions and extend the period in implementation-specified ways.
         *
         * Used to audit the deduplication guarantee described in ``commands.proto``.
         *
         * Optional; the deduplication guarantee applies even if the completion omits this field.
         */
        {
            DeduplicationDuration: /* DeduplicationDuration */ DeduplicationDuration1;
        } | {
            DeduplicationOffset: /* DeduplicationOffset */ DeduplicationOffset1;
        } | {
            Empty: /* Empty */ Empty3;
        };
        /**
         * DeduplicationPeriod
         * Specifies the deduplication period for the change ID (See PrepareSubmissionRequest).
         * If omitted, the participant will assume the configured maximum deduplication time.
         */
        export type DeduplicationPeriod2 = /**
         * DeduplicationPeriod
         * Specifies the deduplication period for the change ID (See PrepareSubmissionRequest).
         * If omitted, the participant will assume the configured maximum deduplication time.
         */
        {
            DeduplicationDuration: /* DeduplicationDuration */ DeduplicationDuration2;
        } | {
            DeduplicationOffset: /* DeduplicationOffset */ DeduplicationOffset2;
        } | {
            Empty: /* Empty */ Empty8;
        };
        /**
         * DeleteIdentityProviderConfigResponse
         * Does not (yet) contain any data.
         */
        export interface DeleteIdentityProviderConfigResponse {
        }
        /**
         * DisclosedContract
         * An additional contract that is used to resolve
         * contract & contract key lookups.
         */
        export interface DisclosedContract {
            /**
             * The template id of the contract.
             * The identifier uses the package-id reference format.
             *
             * Required
             */
            templateId?: string;
            /**
             * The contract id
             * Required
             */
            contractId: string;
            /**
             * Opaque byte string containing the complete payload required by the Daml engine
             * to reconstruct a contract not known to the receiving participant.
             * Required
             */
            createdEventBlob: string;
            /**
             * The ID of the synchronizer where the contract is currently assigned
             * Optional
             */
            synchronizerId: string;
        }
        /**
         * Duration
         */
        export interface Duration {
            seconds: number; // int64
            nanos: number; // int32
            /**
             * This field is automatically added as part of protobuf to json mapping
             */
            unknownFields?: /* UnknownFieldSet */ UnknownFieldSet;
        }
        /**
         * Empty
         */
        export interface Empty {
        }
        /**
         * Empty
         */
        export interface Empty1 {
        }
        /**
         * Empty
         */
        export interface Empty2 {
        }
        /**
         * Empty
         */
        export interface Empty3 {
        }
        /**
         * Empty
         */
        export interface Empty4 {
        }
        /**
         * Empty
         */
        export interface Empty5 {
        }
        /**
         * Empty
         */
        export interface Empty6 {
        }
        /**
         * Empty
         */
        export interface Empty7 {
        }
        /**
         * Empty
         */
        export interface Empty8 {
        }
        /**
         * Event
         * Events in transactions can have two primary shapes:
         *
         * - ACS delta: events can be CreatedEvent or ArchivedEvent
         * - ledger effects: events can be CreatedEvent or ExercisedEvent
         *
         * In the update service the events are restricted to the events
         * visible for the parties specified in the transaction filter. Each
         * event message type below contains a ``witness_parties`` field which
         * indicates the subset of the requested parties that can see the event
         * in question.
         */
        export type Event = /**
         * Event
         * Events in transactions can have two primary shapes:
         *
         * - ACS delta: events can be CreatedEvent or ArchivedEvent
         * - ledger effects: events can be CreatedEvent or ExercisedEvent
         *
         * In the update service the events are restricted to the events
         * visible for the parties specified in the transaction filter. Each
         * event message type below contains a ``witness_parties`` field which
         * indicates the subset of the requested parties that can see the event
         * in question.
         */
        {
            ArchivedEvent: /**
             * ArchivedEvent
             * Records that a contract has been archived, and choices may no longer be exercised on it.
             */
            ArchivedEvent;
        } | {
            CreatedEvent: /**
             * CreatedEvent
             * Records that a contract has been created, and choices may now be exercised on it.
             */
            CreatedEvent;
        } | {
            ExercisedEvent: /**
             * ExercisedEvent
             * Records that a choice has been exercised on a target contract.
             */
            ExercisedEvent;
        };
        /**
         * EventFormat
         * A format for events which defines both which events should be included
         * and what data should be computed and included for them.
         *
         * Note that some of the filtering behavior depends on the `TransactionShape`,
         * which is expected to be specified alongside usages of `EventFormat`.
         */
        export interface EventFormat {
            /**
             * Each key must be a valid PartyIdString (as described in ``value.proto``).
             * The interpretation of the filter depends on the transaction-shape being filtered:
             *
             * 1. For **ledger-effects** create and exercise events are returned, for which the witnesses include at least one of
             *    the listed parties and match the per-party filter.
             * 2. For **transaction and active-contract-set streams** create and archive events are returned for all contracts whose
             *    stakeholders include at least one of the listed parties and match the per-party filter.
             *
             * Optional
             */
            filtersByParty: /* Map_Filters */ MapFilters;
            /**
             * Wildcard filters that apply to all the parties existing on the participant. The interpretation of the filters is the same
             * with the per-party filter as described above.
             * Optional
             */
            filtersForAnyParty?: /**
             * Filters
             * The union of a set of template filters, interface filters, or a wildcard.
             */
            Filters;
            /**
             * If enabled, values served over the API will contain more information than strictly necessary to interpret the data.
             * In particular, setting the verbose flag to true triggers the ledger to include labels for record fields.
             * Optional
             */
            verbose: boolean;
        }
        /**
         * ExecuteSubmissionResponse
         */
        export interface ExecuteSubmissionResponse {
        }
        /**
         * ExerciseByKeyCommand
         * Exercise a choice on an existing contract specified by its key.
         */
        export interface ExerciseByKeyCommand {
            /**
             * The template of contract the client wants to exercise.
             * Both package-name and package-id reference identifier formats for the template-id are supported.
             * Note: The package-id reference identifier format is deprecated. We plan to end support for this format in version 3.4.
             *
             * Required
             */
            templateId: string;
            /**
             * The key of the contract the client wants to exercise upon.
             * Required
             */
            contractKey: any;
            /**
             * The name of the choice the client wants to exercise.
             * Must be a valid NameString (as described in ``value.proto``)
             * Required
             */
            choice: string;
            /**
             * The argument for this choice.
             * Required
             */
            choiceArgument: any;
        }
        /**
         * ExerciseCommand
         * Exercise a choice on an existing contract.
         */
        export interface ExerciseCommand {
            /**
             * The template or interface of the contract the client wants to exercise.
             * Both package-name and package-id reference identifier formats for the template-id are supported.
             * Note: The package-id reference identifier format is deprecated. We plan to end support for this format in version 3.4.
             * To exercise a choice on an interface, specify the interface identifier in the template_id field.
             *
             * Required
             */
            templateId: string;
            /**
             * The ID of the contract the client wants to exercise upon.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            contractId: string;
            /**
             * The name of the choice the client wants to exercise.
             * Must be a valid NameString (as described in ``value.proto``)
             * Required
             */
            choice: string;
            /**
             * The argument for this choice.
             * Required
             */
            choiceArgument: any;
        }
        /**
         * ExercisedEvent
         * Records that a choice has been exercised on a target contract.
         */
        export interface ExercisedEvent {
            /**
             * The offset of origin.
             * Offsets are managed by the participant nodes.
             * Transactions can thus NOT be assumed to have the same offsets on different participant nodes.
             * Required, it is a valid absolute offset (positive integer)
             */
            offset: number; // int64
            /**
             * The position of this event in the originating transaction or reassignment.
             * Node IDs are not necessarily equal across participants,
             * as these may see different projections/parts of transactions.
             * Required, must be valid node ID (non-negative integer)
             */
            nodeId: number; // int32
            /**
             * The ID of the target contract.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            contractId: string;
            /**
             * Identifies the template that defines the executed choice.
             * This template's package-id may differ from the target contract's package-id
             * if the target contract has been upgraded or downgraded.
             *
             * The identifier uses the package-id reference format.
             *
             * Required
             */
            templateId: string;
            /**
             * The interface where the choice is defined, if inherited.
             * If defined, the identifier uses the package-id reference format.
             *
             * Optional
             */
            interfaceId?: string;
            /**
             * The choice that was exercised on the target contract.
             * Must be a valid NameString (as described in ``value.proto``).
             * Required
             */
            choice: string;
            /**
             * The argument of the exercised choice.
             * Required
             */
            choiceArgument: any;
            /**
             * The parties that exercised the choice.
             * Each element must be a valid PartyIdString (as described in ``value.proto``).
             * Required
             */
            actingParties?: string[];
            /**
             * If true, the target contract may no longer be exercised.
             * Required
             */
            consuming: boolean;
            /**
             * The parties that are notified of this event. The witnesses of an exercise
             * node will depend on whether the exercise was consuming or not.
             * If consuming, the witnesses are the union of the stakeholders,
             * the actors and all informees of all the ancestors of this event this
             * participant knows about.
             * If not consuming, the witnesses are the union of the signatories,
             * the actors and all informees of all the ancestors of this event this
             * participant knows about.
             * In both cases the witnesses are limited to the querying parties, or not
             * limited in case anyParty filters are used.
             * Note that the actors might not necessarily be observers
             * and thus stakeholders. This is the case when the controllers of a
             * choice are specified using "flexible controllers", using the
             * ``choice ... controller`` syntax, and said controllers are not
             * explicitly marked as observers.
             * Each element must be a valid PartyIdString (as described in ``value.proto``).
             * Required
             */
            witnessParties?: string[];
            /**
             * Specifies the upper boundary of the node ids of the events in the same transaction that appeared as a result of
             * this ``ExercisedEvent``. This allows unambiguous identification of all the members of the subtree rooted at this
             * node. A full subtree can be constructed when all descendant nodes are present in the stream. If nodes are heavily
             * filtered, it is only possible to determine if a node is in a consequent subtree or not.
             * Required
             */
            lastDescendantNodeId: number; // int32
            /**
             * The result of exercising the choice.
             * Required
             */
            exerciseResult: any;
            /**
             * The package name of the contract.
             * Required
             */
            packageName: string;
            /**
             * If the event is consuming, the interfaces implemented by the target template that have been
             * matched from the interface filter query.
             * Populated only in case interface filters with include_interface_view set.
             *
             * The identifier uses the package-id reference format.
             *
             * Optional
             */
            implementedInterfaces?: string[];
        }
        /**
         * ExercisedTreeEvent
         */
        export interface ExercisedTreeEvent {
            value: /**
             * ExercisedEvent
             * Records that a choice has been exercised on a target contract.
             */
            ExercisedEvent;
        }
        /**
         * ExperimentalCommandInspectionService
         * Whether the Ledger API supports command inspection service
         */
        export interface ExperimentalCommandInspectionService {
            /**
             *
             */
            supported: boolean;
        }
        /**
         * ExperimentalFeatures
         * See the feature message definitions for descriptions.
         */
        export interface ExperimentalFeatures {
            /**
             *
             */
            staticTime?: /**
             * ExperimentalStaticTime
             * Ledger is in the static time mode and exposes a time service.
             */
            ExperimentalStaticTime;
            /**
             *
             */
            commandInspectionService?: /**
             * ExperimentalCommandInspectionService
             * Whether the Ledger API supports command inspection service
             */
            ExperimentalCommandInspectionService;
        }
        /**
         * ExperimentalStaticTime
         * Ledger is in the static time mode and exposes a time service.
         */
        export interface ExperimentalStaticTime {
            /**
             *
             */
            supported: boolean;
        }
        /**
         * FeaturesDescriptor
         */
        export interface FeaturesDescriptor {
            /**
             * Features under development or features that are used
             * for ledger implementation testing purposes only.
             *
             * Daml applications SHOULD not depend on these in production.
             */
            experimental?: /**
             * ExperimentalFeatures
             * See the feature message definitions for descriptions.
             */
            ExperimentalFeatures;
            /**
             * If set, then the Ledger API server supports user management.
             * It is recommended that clients query this field to gracefully adjust their behavior for
             * ledgers that do not support user management.
             */
            userManagement?: /* UserManagementFeature */ UserManagementFeature;
            /**
             * If set, then the Ledger API server supports party management configurability.
             * It is recommended that clients query this field to gracefully adjust their behavior to
             * maximum party page size.
             */
            partyManagement?: /* PartyManagementFeature */ PartyManagementFeature;
            /**
             * It contains the timeouts related to the periodic offset checkpoint emission
             */
            offsetCheckpoint?: /* OffsetCheckpointFeature */ OffsetCheckpointFeature;
        }
        /**
         * Field
         */
        export interface Field {
            varint?: number /* int64 */[];
            fixed64?: number /* int64 */[];
            fixed32?: number /* int32 */[];
            lengthDelimited?: string[];
        }
        /**
         * FieldMask
         */
        export interface FieldMask {
            paths?: string[];
            unknownFields: /* UnknownFieldSet */ UnknownFieldSet;
        }
        /**
         * Filters
         * The union of a set of template filters, interface filters, or a wildcard.
         */
        export interface Filters {
            /**
             * Every filter in the cumulative list expands the scope of the resulting stream. Each interface,
             * template or wildcard filter means additional events that will match the query.
             * The impact of include_interface_view and include_created_event_blob fields in the filters will
             * also be accumulated.
             * A template or an interface SHOULD NOT appear twice in the accumulative field.
             * A wildcard filter SHOULD NOT be defined more than once in the accumulative field.
             * Optional, if no ``CumulativeFilter`` defined, the default of a single ``WildcardFilter`` with
             * include_created_event_blob unset is used.
             */
            cumulative?: /**
             * CumulativeFilter
             * A filter that matches all contracts that are either an instance of one of
             * the ``template_filters`` or that match one of the ``interface_filters``.
             */
            CumulativeFilter[];
        }
        /**
         * GetActiveContractsRequest
         * If the given offset is different than the ledger end, and there are (un)assignments in-flight at the given offset,
         * the snapshot may fail with "FAILED_PRECONDITION/PARTICIPANT_PRUNED_DATA_ACCESSED".
         * Note that it is ok to request acs snapshots for party migration with offsets other than ledger end, because party
         * migration is not concerned with incomplete (un)assignments.
         */
        export interface GetActiveContractsRequest {
            /**
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Templates to include in the served snapshot, per party.
             * Optional, if specified event_format must be unset, if not specified event_format must be set.
             */
            filter?: /**
             * TransactionFilter
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Used both for filtering create and archive events as well as for filtering transaction trees.
             */
            TransactionFilter;
            /**
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * If enabled, values served over the API will contain more information than strictly necessary to interpret the data.
             * In particular, setting the verbose flag to true triggers the ledger to include labels for record fields.
             * Optional, if specified event_format must be unset.
             */
            verbose: boolean;
            /**
             * The offset at which the snapshot of the active contracts will be computed.
             * Must be no greater than the current ledger end offset.
             * Must be greater than or equal to the last pruning offset.
             * Required, must be a valid absolute offset (positive integer) or ledger begin offset (zero).
             * If zero, the empty set will be returned.
             */
            activeAtOffset: number; // int64
            /**
             * Format of the contract_entries in the result. In case of CreatedEvent the presentation will be of
             * TRANSACTION_SHAPE_ACS_DELTA.
             * Optional for backwards compatibility, defaults to an EventFormat where:
             *
             * - filters_by_party is the filter.filters_by_party from this request
             * - filters_for_any_party is the filter.filters_for_any_party from this request
             * - verbose is the verbose field from this request
             */
            eventFormat?: /**
             * EventFormat
             * A format for events which defines both which events should be included
             * and what data should be computed and included for them.
             *
             * Note that some of the filtering behavior depends on the `TransactionShape`,
             * which is expected to be specified alongside usages of `EventFormat`.
             */
            EventFormat;
        }
        /**
         * GetConnectedSynchronizersResponse
         */
        export interface GetConnectedSynchronizersResponse {
            /**
             *
             */
            connectedSynchronizers?: /* ConnectedSynchronizer */ ConnectedSynchronizer[];
        }
        /**
         * GetEventsByContractIdRequest
         */
        export interface GetEventsByContractIdRequest {
            /**
             * The contract id being queried.
             * Required
             */
            contractId: string;
            /**
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * The parties whose events the client expects to see.
             * The events associated with the contract id will only be returned if the requesting parties includes
             * at least one party that is a stakeholder of the event. For a definition of stakeholders see
             * https://docs.daml.com/concepts/ledger-model/ledger-privacy.html#contract-observers-and-stakeholders
             * Optional, if some parties specified, event_format needs to be unset.
             */
            requestingParties?: string[];
            /**
             * Format of the events in the result, the presentation will be of TRANSACTION_SHAPE_ACS_DELTA.
             * Optional for backwards compatibility, defaults to an EventFormat where:
             *
             * - filters_by_party is a template-wildcard filter for all requesting_parties
             * - filters_for_any_party is unset
             * - verbose is set
             */
            eventFormat?: /**
             * EventFormat
             * A format for events which defines both which events should be included
             * and what data should be computed and included for them.
             *
             * Note that some of the filtering behavior depends on the `TransactionShape`,
             * which is expected to be specified alongside usages of `EventFormat`.
             */
            EventFormat;
        }
        /**
         * GetIdentityProviderConfigResponse
         */
        export interface GetIdentityProviderConfigResponse {
            /**
             *
             */
            identityProviderConfig?: /* IdentityProviderConfig */ IdentityProviderConfig;
        }
        /**
         * GetLatestPrunedOffsetsResponse
         */
        export interface GetLatestPrunedOffsetsResponse {
            /**
             * It will always be a non-negative integer.
             * If positive, the absolute offset up to which the ledger has been pruned,
             * disregarding the state of all divulged contracts pruning.
             * If zero, the ledger has not been pruned yet.
             */
            participantPrunedUpToInclusive: number; // int64
            /**
             * It will always be a non-negative integer.
             * If positive, the absolute offset up to which all divulged events have been pruned on the ledger.
             * It can be at or before the ``participant_pruned_up_to_inclusive`` offset.
             * For more details about all divulged events pruning,
             * see ``PruneRequest.prune_all_divulged_contracts`` in ``participant_pruning_service.proto``.
             * If zero, the divulged events have not been pruned yet.
             */
            allDivulgedContractsPrunedUpToInclusive: number; // int64
        }
        /**
         * GetLedgerApiVersionResponse
         */
        export interface GetLedgerApiVersionResponse {
            /**
             * The version of the ledger API.
             */
            version: string;
            /**
             * The features supported by this Ledger API endpoint.
             *
             * Daml applications CAN use the feature descriptor on top of
             * version constraints on the Ledger API version to determine
             * whether a given Ledger API endpoint supports the features
             * required to run the application.
             *
             * See the feature descriptions themselves for the relation between
             * Ledger API versions and feature presence.
             */
            features?: /* FeaturesDescriptor */ FeaturesDescriptor;
        }
        /**
         * GetLedgerEndResponse
         */
        export interface GetLedgerEndResponse {
            /**
             * It will always be a non-negative integer.
             * If zero, the participant view of the ledger is empty.
             * If positive, the absolute offset of the ledger as viewed by the participant.
             */
            offset: number; // int64
        }
        /**
         * GetPackageStatusResponse
         */
        export interface GetPackageStatusResponse {
            /**
             * The status of the package.
             */
            packageStatus: string;
        }
        /**
         * GetParticipantIdResponse
         */
        export interface GetParticipantIdResponse {
            /**
             * Identifier of the participant, which SHOULD be globally unique.
             * Must be a valid LedgerString (as describe in ``value.proto``).
             */
            participantId: string;
        }
        /**
         * GetPartiesResponse
         */
        export interface GetPartiesResponse {
            /**
             * The details of the requested Daml parties by the participant, if known.
             * The party details may not be in the same order as requested.
             * Required
             */
            partyDetails?: /* PartyDetails */ PartyDetails[];
        }
        /**
         * GetPreferredPackageVersionResponse
         */
        export interface GetPreferredPackageVersionResponse {
            /**
             * Not populated when no preferred package is found
             * Optional
             */
            packagePreference?: /* PackagePreference */ PackagePreference;
        }
        /**
         * GetPreferredPackagesRequest
         */
        export interface GetPreferredPackagesRequest {
            /**
             * The package-name vetting requirements for which the preferred packages should be resolved.
             *
             * Generally it is enough to provide the requirements for the intended command's root package-names.
             * Additional package-name requirements can be provided when additional Daml transaction informees need to use
             * package dependencies of the command's root packages.
             *
             * Required
             */
            packageVettingRequirements?: /**
             * PackageVettingRequirement
             * Defines a package-name for which the commonly vetted package with the highest version must be found.
             */
            PackageVettingRequirement[];
            /**
             * The synchronizer whose vetting state should be used for resolving this query.
             * If not specified, the vetting states of all synchronizers to which the participant is connected are used.
             * Optional
             */
            synchronizerId: string;
            /**
             * The timestamp at which the package vetting validity should be computed
             * on the latest topology snapshot as seen by the participant.
             * If not provided, the participant's current clock time is used.
             * Optional
             */
            vettingValidAt?: string;
        }
        /**
         * GetPreferredPackagesResponse
         */
        export interface GetPreferredPackagesResponse {
            /**
             * The package references of the preferred packages.
             * Must contain one package reference for each requested package-name.
             *
             * If you build command submissions whose content depends on the returned
             * preferred packages, then we recommend submitting the preferred package-ids
             * in the ``package_id_selection_preference`` of the command submission to
             * avoid race conditions with concurrent changes of the on-ledger package vetting state.
             *
             * Required
             */
            packageReferences?: /* PackageReference */ PackageReference[];
            /**
             * The synchronizer for which the package preferences are computed.
             * If the synchronizer_id was specified in the request, then it matches the request synchronizer_id.
             * Required
             */
            synchronizerId: string;
        }
        /**
         * GetTransactionByIdRequest
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         */
        export interface GetTransactionByIdRequest {
            /**
             * The ID of a particular transaction.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            updateId: string;
            /**
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * The parties whose events the client expects to see.
             * Events that are not visible for the parties in this collection will not be present in the response.
             * Each element must be a valid PartyIdString (as described in ``value.proto``).
             * Must be set for GetTransactionTreeById request.
             * Optional for backwards compatibility for GetTransactionById request: if defined transaction_format must be
             * unset (falling back to defaults).
             */
            requestingParties?: string[];
            /**
             * Must be unset for GetTransactionTreeById request.
             * Optional for GetTransactionById request for backwards compatibility: defaults to a transaction_format, where:
             *
             * - event_format.filters_by_party will have template-wildcard filters for all the requesting_parties
             * - event_format.filters_for_any_party is unset
             * - event_format.verbose = true
             * - transaction_shape = TRANSACTION_SHAPE_ACS_DELTA
             */
            transactionFormat?: /**
             * TransactionFormat
             * A format that specifies what events to include in Daml transactions
             * and what data to compute and include for them.
             */
            TransactionFormat;
        }
        /**
         * GetTransactionByOffsetRequest
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         */
        export interface GetTransactionByOffsetRequest {
            /**
             * The offset of the transaction being looked up.
             * Must be a valid absolute offset (positive integer).
             * Required
             */
            offset: number; // int64
            /**
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * The parties whose events the client expects to see.
             * Events that are not visible for the parties in this collection will not be present in the response.
             * Each element must be a valid PartyIdString (as described in ``value.proto``).
             * Must be set for GetTransactionTreeByOffset request.
             * Optional for backwards compatibility for GetTransactionByOffset request: if defined transaction_format must be
             * unset (falling back to defaults).
             */
            requestingParties?: string[];
            /**
             * Must be unset for GetTransactionTreeByOffset request.
             * Optional for GetTransactionByOffset request for backwards compatibility: defaults to a TransactionFormat, where:
             *
             * - event_format.filters_by_party will have template-wildcard filters for all the requesting_parties
             * - event_format.filters_for_any_party is unset
             * - event_format.verbose = true
             * - transaction_shape = TRANSACTION_SHAPE_ACS_DELTA
             */
            transactionFormat?: /**
             * TransactionFormat
             * A format that specifies what events to include in Daml transactions
             * and what data to compute and include for them.
             */
            TransactionFormat;
        }
        /**
         * GetUpdateByIdRequest
         */
        export interface GetUpdateByIdRequest {
            /**
             * The ID of a particular update.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            updateId: string;
            /**
             * The format for the update.
             * Required
             */
            updateFormat?: /**
             * UpdateFormat
             * A format specifying what updates to include and how to render them.
             */
            UpdateFormat;
        }
        /**
         * GetUpdateByOffsetRequest
         */
        export interface GetUpdateByOffsetRequest {
            /**
             * The offset of the update being looked up.
             * Must be a valid absolute offset (positive integer).
             * Required
             */
            offset: number; // int64
            /**
             * The format for the update.
             * Required
             */
            updateFormat?: /**
             * UpdateFormat
             * A format specifying what updates to include and how to render them.
             */
            UpdateFormat;
        }
        /**
         * GetUpdatesRequest
         */
        export interface GetUpdatesRequest {
            /**
             * Beginning of the requested ledger section (non-negative integer).
             * The response will only contain transactions whose offset is strictly greater than this.
             * If zero, the stream will start from the beginning of the ledger.
             * If positive, the streaming will start after this absolute offset.
             * If the ledger has been pruned, this parameter must be specified and be greater than the pruning offset.
             */
            beginExclusive: number; // int64
            /**
             * End of the requested ledger section.
             * The response will only contain transactions whose offset is less than or equal to this.
             * Optional, if empty, the stream will not terminate.
             * If specified, the stream will terminate after this absolute offset (positive integer) is reached.
             */
            endInclusive?: number; // int64
            /**
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Requesting parties with template filters.
             * Template filters must be empty for GetUpdateTrees requests.
             * Optional for backwards compatibility, if defined update_format must be unset
             */
            filter?: /**
             * TransactionFilter
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Used both for filtering create and archive events as well as for filtering transaction trees.
             */
            TransactionFilter;
            /**
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * If enabled, values served over the API will contain more information than strictly necessary to interpret the data.
             * In particular, setting the verbose flag to true triggers the ledger to include labels, record and variant type ids
             * for record fields.
             * Optional for backwards compatibility, if defined update_format must be unset
             */
            verbose: boolean;
            /**
             * Must be unset for GetUpdateTrees request.
             * Optional for backwards compatibility for GetUpdates request: defaults to an UpdateFormat where:
             *
             * - include_transactions.event_format.filters_by_party = the filter.filters_by_party on this request
             * - include_transactions.event_format.filters_for_any_party = the filter.filters_for_any_party on this request
             * - include_transactions.event_format.verbose = the same flag specified on this request
             * - include_transactions.transaction_shape = TRANSACTION_SHAPE_ACS_DELTA
             * - include_reassignments.filter = the same filter specified on this request
             * - include_reassignments.verbose = the same flag specified on this request
             * - include_topology_events.include_participant_authorization_events.parties = all the parties specified in filter
             */
            updateFormat?: /**
             * UpdateFormat
             * A format specifying what updates to include and how to render them.
             */
            UpdateFormat;
        }
        /**
         * GetUserResponse
         */
        export interface GetUserResponse {
            /**
             * Retrieved user.
             */
            user?: /**
             * User
             *  Users and rights
             * /////////////////
             *  Users are used to dynamically manage the rights given to Daml applications.
             *  They are stored and managed per participant node.
             */
            User;
        }
        /**
         * GrantUserRightsRequest
         * Add the rights to the set of rights granted to the user.
         *
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(identity_provider_id)``
         */
        export interface GrantUserRightsRequest {
            /**
             * The user to whom to grant rights.
             * Required
             */
            userId: string;
            /**
             * The rights to grant.
             * Optional
             */
            rights?: /**
             * Right
             * A right granted to a user.
             */
            Right[];
            /**
             * The id of the ``Identity Provider``
             * Optional, if not set, assume the user is managed by the default identity provider.
             */
            identityProviderId: string;
        }
        /**
         * GrantUserRightsResponse
         */
        export interface GrantUserRightsResponse {
            /**
             * The rights that were newly granted by the request.
             */
            newlyGrantedRights?: /**
             * Right
             * A right granted to a user.
             */
            Right[];
        }
        /**
         * Identifier
         */
        export interface Identifier {
            packageId: string;
            moduleName: string;
            entityName: string;
        }
        /**
         * IdentifierFilter
         */
        export type IdentifierFilter = /* IdentifierFilter */ {
            Empty: /* Empty */ Empty1;
        } | {
            InterfaceFilter: /**
             * InterfaceFilter
             * This filter matches contracts that implement a specific interface.
             */
            InterfaceFilter;
        } | {
            TemplateFilter: /**
             * TemplateFilter
             * This filter matches contracts of a specific template.
             */
            TemplateFilter;
        } | {
            WildcardFilter: /**
             * WildcardFilter
             * This filter matches all templates.
             */
            WildcardFilter;
        };
        /**
         * IdentityProviderAdmin
         */
        export interface IdentityProviderAdmin {
            value: /* IdentityProviderAdmin */ IdentityProviderAdmin1;
        }
        /**
         * IdentityProviderAdmin
         */
        export interface IdentityProviderAdmin1 {
        }
        /**
         * IdentityProviderConfig
         */
        export interface IdentityProviderConfig {
            /**
             * The identity provider identifier
             * Must be a valid LedgerString (as describe in ``value.proto``).
             * Required
             */
            identityProviderId: string;
            /**
             * When set, the callers using JWT tokens issued by this identity provider are denied all access
             * to the Ledger API.
             * Optional,
             * Modifiable
             */
            isDeactivated: boolean;
            /**
             * Specifies the issuer of the JWT token.
             * The issuer value is a case sensitive URL using the https scheme that contains scheme, host,
             * and optionally, port number and path components and no query or fragment components.
             * Required
             * Modifiable
             */
            issuer: string;
            /**
             * The JWKS (JSON Web Key Set) URL.
             * The Ledger API uses JWKs (JSON Web Keys) from the provided URL to verify that the JWT has been
             * signed with the loaded JWK. Only RS256 (RSA Signature with SHA-256) signing algorithm is supported.
             * Required
             * Modifiable
             */
            jwksUrl: string;
            /**
             * Specifies the audience of the JWT token.
             * When set, the callers using JWT tokens issued by this identity provider are allowed to get an access
             * only if the "aud" claim includes the string specified here
             * Optional,
             * Modifiable
             */
            audience: string;
        }
        /**
         * InterfaceFilter
         * This filter matches contracts that implement a specific interface.
         */
        export interface InterfaceFilter {
            value: /**
             * InterfaceFilter
             * This filter matches contracts that implement a specific interface.
             */
            InterfaceFilter1;
        }
        /**
         * InterfaceFilter
         * This filter matches contracts that implement a specific interface.
         */
        export interface InterfaceFilter1 {
            /**
             * The interface that a matching contract must implement.
             * The ``interface_id`` needs to be valid: corresponding interface should be defined in
             * one of the available packages at the time of the query.
             * Both package-name and package-id reference formats for the identifier are supported.
             * Note: The package-id reference identifier format is deprecated. We plan to end support for this format in version 3.4.
             *
             * Required
             */
            interfaceId?: string;
            /**
             * Whether to include the interface view on the contract in the returned ``CreatedEvent``.
             * Use this to access contract data in a uniform manner in your API client.
             * Optional
             */
            includeInterfaceView: boolean;
            /**
             * Whether to include a ``created_event_blob`` in the returned ``CreatedEvent``.
             * Use this to access the contract create event payload in your API client
             * for submitting it as a disclosed contract with future commands.
             * Optional
             */
            includeCreatedEventBlob: boolean;
        }
        /**
         * JsActiveContract
         */
        export interface JsActiveContract {
            /**
             * Required
             * The event as it appeared in the context of its last update (i.e. daml transaction or
             * reassignment). In particular, the last offset, node_id pair is preserved.
             * The last update is the most recent update created or assigned this contract on synchronizer_id synchronizer.
             * The offset of the CreatedEvent might point to an already pruned update, therefore it cannot necessarily be used
             * for lookups.
             */
            createdEvent: /**
             * CreatedEvent
             * Records that a contract has been created, and choices may now be exercised on it.
             */
            CreatedEvent;
            /**
             * A valid synchronizer id
             * Required
             */
            synchronizerId: string;
            /**
             * Each corresponding assigned and unassigned event has the same reassignment_counter. This strictly increases
             * with each unassign command for the same contract. Creation of the contract corresponds to reassignment_counter
             * equals zero.
             * This field will be the reassignment_counter of the latest observable activation event on this synchronizer, which is
             * before the active_at_offset.
             * Required
             */
            reassignmentCounter: number; // int64
        }
        /**
         * JsArchived
         */
        export interface JsArchived {
            /**
             * Required
             */
            archivedEvent: /**
             * ArchivedEvent
             * Records that a contract has been archived, and choices may no longer be exercised on it.
             */
            ArchivedEvent;
            /**
             * Required
             * The synchronizer which sequenced the archival of the contract
             */
            synchronizerId: string;
        }
        /**
         * JsAssignedEvent
         * Records that a contract has been assigned, and it can be used on the target synchronizer.
         */
        export interface JsAssignedEvent {
            /**
             * The ID of the source synchronizer.
             * Must be a valid synchronizer id.
             * Required
             */
            source: string;
            /**
             * The ID of the target synchronizer.
             * Must be a valid synchronizer id.
             * Required
             */
            target: string;
            /**
             * The ID from the unassigned event.
             * For correlation capabilities.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            reassignmentId: string;
            /**
             * Party on whose behalf the assign command was executed.
             * Empty if the assignment happened offline via the repair service.
             * Must be a valid PartyIdString (as described in ``value.proto``).
             * Optional
             */
            submitter: string;
            /**
             * Each corresponding assigned and unassigned event has the same reassignment_counter. This strictly increases
             * with each unassign command for the same contract. Creation of the contract corresponds to reassignment_counter
             * equals zero.
             * Required
             */
            reassignmentCounter: number; // int64
            /**
             * Required
             * The offset of this event refers to the offset of the assignment,
             * while the node_id is the index of within the batch.
             */
            createdEvent: /**
             * CreatedEvent
             * Records that a contract has been created, and choices may now be exercised on it.
             */
            CreatedEvent;
        }
        /**
         * JsAssignmentEvent
         */
        export interface JsAssignmentEvent {
            source: string;
            target: string;
            reassignmentId: string;
            submitter: string;
            reassignmentCounter: number; // int64
            createdEvent: /**
             * CreatedEvent
             * Records that a contract has been created, and choices may now be exercised on it.
             */
            CreatedEvent;
        }
        /**
         * JsCantonError
         */
        export interface JsCantonError {
            code: string;
            cause: string;
            correlationId?: string;
            traceId?: string;
            context: /* Map_String */ MapString;
            resources?: /* Tuple2_String_String */ Tuple2StringString[];
            errorCategory: number; // int32
            grpcCodeValue?: number; // int32
            retryInfo?: string;
            definiteAnswer?: boolean;
        }
        /**
         * JsCommands
         * A composite command that groups multiple commands together.
         */
        export interface JsCommands {
            /**
             * Individual elements of this atomic command. Must be non-empty.
             * Required
             */
            commands?: /**
             * Command
             * A command can either create a new contract or exercise a choice on an existing contract.
             */
            Command[];
            /**
             * Uniquely identifies the command.
             * The triple (user_id, act_as, command_id) constitutes the change ID for the intended ledger change,
             * where act_as is interpreted as a set of party names.
             * The change ID can be used for matching the intended ledger changes with all their completions.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            commandId: string;
            /**
             * Set of parties on whose behalf the command should be executed.
             * If ledger API authorization is enabled, then the authorization metadata must authorize the sender of the request
             * to act on behalf of each of the given parties.
             * Each element must be a valid PartyIdString (as described in ``value.proto``).
             * Required, must be non-empty.
             */
            actAs?: string[];
            /**
             * Uniquely identifies the participant user that issued the command.
             * Must be a valid UserIdString (as described in ``value.proto``).
             * Required unless authentication is used with a user token.
             * In that case, the token's user-id will be used for the request's user_id.
             */
            userId?: string;
            /**
             * Set of parties on whose behalf (in addition to all parties listed in ``act_as``) contracts can be retrieved.
             * This affects Daml operations such as ``fetch``, ``fetchByKey``, ``lookupByKey``, ``exercise``, and ``exerciseByKey``.
             * Note: A participant node of a Daml network can host multiple parties. Each contract present on the participant
             * node is only visible to a subset of these parties. A command can only use contracts that are visible to at least
             * one of the parties in ``act_as`` or ``read_as``. This visibility check is independent from the Daml authorization
             * rules for fetch operations.
             * If ledger API authorization is enabled, then the authorization metadata must authorize the sender of the request
             * to read contract data on behalf of each of the given parties.
             * Optional
             */
            readAs?: string[];
            /**
             * Identifier of the on-ledger workflow that this command is a part of.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            workflowId?: string;
            deduplicationPeriod?: /**
             * DeduplicationPeriod
             * Specifies the deduplication period for the change ID.
             * If omitted, the participant will assume the configured maximum deduplication time.
             */
            DeduplicationPeriod;
            /**
             * Lower bound for the ledger time assigned to the resulting transaction.
             * Note: The ledger time of a transaction is assigned as part of command interpretation.
             * Use this property if you expect that command interpretation will take a considerate amount of time, such that by
             * the time the resulting transaction is sequenced, its assigned ledger time is not valid anymore.
             * Must not be set at the same time as min_ledger_time_rel.
             * Optional
             */
            minLedgerTimeAbs?: string;
            /**
             * Same as min_ledger_time_abs, but specified as a duration, starting from the time the command is received by the server.
             * Must not be set at the same time as min_ledger_time_abs.
             * Optional
             */
            minLedgerTimeRel?: /* Duration */ Duration;
            /**
             * A unique identifier to distinguish completions for different submissions with the same change ID.
             * Typically a random UUID. Applications are expected to use a different UUID for each retry of a submission
             * with the same change ID.
             * Must be a valid LedgerString (as described in ``value.proto``).
             *
             * If omitted, the participant or the committer may set a value of their choice.
             * Optional
             */
            submissionId?: string;
            /**
             * Additional contracts used to resolve contract & contract key lookups.
             * Optional
             */
            disclosedContracts?: /**
             * DisclosedContract
             * An additional contract that is used to resolve
             * contract & contract key lookups.
             */
            DisclosedContract[];
            /**
             * Must be a valid synchronizer id
             * Optional
             */
            synchronizerId?: string;
            /**
             * The package-id selection preference of the client for resolving
             * package names and interface instances in command submission and interpretation
             */
            packageIdSelectionPreference?: string[];
            /**
             * Fetches the contract keys into the caches to speed up the command processing.
             * Should only contain contract keys that are expected to be resolved during interpretation of the commands.
             * Keys of disclosed contracts do not need prefetching.
             *
             * Optional
             */
            prefetchContractKeys?: /**
             * PrefetchContractKey
             * Preload contracts
             */
            PrefetchContractKey[];
        }
        /**
         * JsContractEntry
         * For a contract there could be multiple contract_entry-s in the entire snapshot. These together define
         * the state of one contract in the snapshot.
         * A contract_entry is included in the result, if and only if there is at least one stakeholder party of the contract
         * that is hosted on the synchronizer at the time of the event and the party satisfies the
         * ``TransactionFilter`` in the query.
         */
        export type JsContractEntry = /**
         * JsContractEntry
         * For a contract there could be multiple contract_entry-s in the entire snapshot. These together define
         * the state of one contract in the snapshot.
         * A contract_entry is included in the result, if and only if there is at least one stakeholder party of the contract
         * that is hosted on the synchronizer at the time of the event and the party satisfies the
         * ``TransactionFilter`` in the query.
         */
        {
            JsActiveContract: /* JsActiveContract */ JsActiveContract;
        } | {
            JsEmpty: /* JsEmpty */ JsEmpty;
        } | {
            JsIncompleteAssigned: /* JsIncompleteAssigned */ JsIncompleteAssigned;
        } | {
            JsIncompleteUnassigned: /* JsIncompleteUnassigned */ JsIncompleteUnassigned;
        };
        /**
         * JsCreated
         */
        export interface JsCreated {
            /**
             * Required
             * The event as it appeared in the context of its original update (i.e. daml transaction or
             * reassignment) on this participant node. You can use its offset and node_id to find the
             * corresponding update and the node within it.
             */
            createdEvent: /**
             * CreatedEvent
             * Records that a contract has been created, and choices may now be exercised on it.
             */
            CreatedEvent;
            /**
             * The synchronizer which sequenced the creation of the contract
             * Required
             */
            synchronizerId: string;
        }
        /**
         * JsEmpty
         */
        export interface JsEmpty {
        }
        /**
         * JsExecuteSubmissionRequest
         */
        export interface JsExecuteSubmissionRequest {
            /**
             * the prepared transaction
             * Typically this is the value of the `prepared_transaction` field in `PrepareSubmissionResponse`
             * obtained from calling `prepareSubmission`.
             */
            preparedTransaction?: string;
            /**
             * The party(ies) signatures that authorize the prepared submission to be executed by this node.
             * Each party can provide one or more signatures..
             * and one or more parties can sign.
             * Note that currently, only single party submissions are supported.
             */
            partySignatures?: /**
             * PartySignatures
             * Additional signatures provided by the submitting parties
             */
            PartySignatures;
            deduplicationPeriod: /**
             * DeduplicationPeriod
             * Specifies the deduplication period for the change ID (See PrepareSubmissionRequest).
             * If omitted, the participant will assume the configured maximum deduplication time.
             */
            DeduplicationPeriod2;
            /**
             * A unique identifier to distinguish completions for different submissions with the same change ID.
             * Typically a random UUID. Applications are expected to use a different UUID for each retry of a submission
             * with the same change ID.
             * Must be a valid LedgerString (as described in ``value.proto``).
             *
             * Required
             */
            submissionId: string;
            /**
             * See [PrepareSubmissionRequest.user_id]
             */
            userId: string;
            /**
             * The hashing scheme version used when building the hash
             */
            hashingSchemeVersion: string;
            /**
             * If set will influence the chosen ledger effective time but will not result in a submission delay so any override
             * should be scheduled to executed within the window allowed by synchronizer.
             * Optional
             */
            minLedgerTime?: /* MinLedgerTime */ MinLedgerTime;
        }
        /**
         * JsGetActiveContractsResponse
         */
        export interface JsGetActiveContractsResponse {
            /**
             * The workflow ID used in command submission which corresponds to the contract_entry. Only set if
             * the ``workflow_id`` for the command was set.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            workflowId: string;
            contractEntry: /**
             * JsContractEntry
             * For a contract there could be multiple contract_entry-s in the entire snapshot. These together define
             * the state of one contract in the snapshot.
             * A contract_entry is included in the result, if and only if there is at least one stakeholder party of the contract
             * that is hosted on the synchronizer at the time of the event and the party satisfies the
             * ``TransactionFilter`` in the query.
             */
            JsContractEntry;
        }
        /**
         * JsGetEventsByContractIdResponse
         */
        export interface JsGetEventsByContractIdResponse {
            /**
             * The create event for the contract with the ``contract_id`` given in the request
             * provided it exists and has not yet been pruned.
             * Optional
             */
            created?: /* JsCreated */ JsCreated;
            /**
             * The archive event for the contract with the ``contract_id`` given in the request
             * provided such an archive event exists and it has not yet been pruned.
             * Optional
             */
            archived?: /* JsArchived */ JsArchived;
        }
        /**
         * JsGetTransactionResponse
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         */
        export interface JsGetTransactionResponse {
            /**
             * Required
             */
            transaction: /**
             * JsTransaction
             * Filtered view of an on-ledger transaction's create and archive events.
             */
            JsTransaction;
        }
        /**
         * JsGetTransactionTreeResponse
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         */
        export interface JsGetTransactionTreeResponse {
            /**
             * Required
             */
            transaction: /**
             * JsTransactionTree
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Complete view of an on-ledger transaction.
             */
            JsTransactionTree;
        }
        /**
         * JsGetUpdateResponse
         */
        export interface JsGetUpdateResponse {
            update: /* Update */ Update;
        }
        /**
         * JsGetUpdateTreesResponse
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         */
        export interface JsGetUpdateTreesResponse {
            update: /**
             * Update
             * The update that matches the filter in the request.
             */
            Update1;
        }
        /**
         * JsGetUpdatesResponse
         */
        export interface JsGetUpdatesResponse {
            update: /* Update */ Update;
        }
        /**
         * JsIncompleteAssigned
         */
        export interface JsIncompleteAssigned {
            /**
             * Required
             */
            assignedEvent: /**
             * JsAssignedEvent
             * Records that a contract has been assigned, and it can be used on the target synchronizer.
             */
            JsAssignedEvent;
        }
        /**
         * JsIncompleteUnassigned
         */
        export interface JsIncompleteUnassigned {
            /**
             * Required
             * The event as it appeared in the context of its last activation update (i.e. daml transaction or
             * reassignment). In particular, the last activation offset, node_id pair is preserved.
             * The last activation update is the most recent update created or assigned this contract on synchronizer_id synchronizer before
             * the unassigned_event.
             * The offset of the CreatedEvent might point to an already pruned update, therefore it cannot necessarily be used
             * for lookups.
             */
            createdEvent: /**
             * CreatedEvent
             * Records that a contract has been created, and choices may now be exercised on it.
             */
            CreatedEvent;
            /**
             * Required
             */
            unassignedEvent: /**
             * UnassignedEvent
             * Records that a contract has been unassigned, and it becomes unusable on the source synchronizer
             */
            UnassignedEvent;
        }
        /**
         * JsInterfaceView
         * View of a create event matched by an interface filter.
         */
        export interface JsInterfaceView {
            /**
             * The interface implemented by the matched event.
             * The identifier uses the package-id reference format.
             *
             * Required
             */
            interfaceId: string;
            /**
             * Whether the view was successfully computed, and if not,
             * the reason for the error. The error is reported using the same rules
             * for error codes and messages as the errors returned for API requests.
             * Required
             */
            viewStatus: /* JsStatus */ JsStatus;
            /**
             * The value of the interface's view method on this event.
             * Set if it was requested in the ``InterfaceFilter`` and it could be
             * successfully computed.
             * Optional
             */
            viewValue?: any;
        }
        /**
         * JsPrepareSubmissionRequest
         */
        export interface JsPrepareSubmissionRequest {
            /**
             * Uniquely identifies the participant user that prepares the transaction.
             * Must be a valid UserIdString (as described in ``value.proto``).
             * Required unless authentication is used with a user token.
             * In that case, the token's user-id will be used for the request's user_id.
             */
            userId: string;
            /**
             * Uniquely identifies the command.
             * The triple (user_id, act_as, command_id) constitutes the change ID for the intended ledger change,
             * where act_as is interpreted as a set of party names.
             * The change ID can be used for matching the intended ledger changes with all their completions.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            commandId: string;
            /**
             * Individual elements of this atomic command. Must be non-empty.
             * Required
             */
            commands?: /**
             * Command
             * A command can either create a new contract or exercise a choice on an existing contract.
             */
            Command[];
            /**
             * Optional
             */
            minLedgerTime?: /* MinLedgerTime */ MinLedgerTime;
            /**
             * Set of parties on whose behalf the command should be executed, if submitted.
             * If ledger API authorization is enabled, then the authorization metadata must authorize the sender of the request
             * to **read** (not act) on behalf of each of the given parties. This is because this RPC merely prepares a transaction
             * and does not execute it. Therefore read authorization is sufficient even for actAs parties.
             * Note: This may change, and more specific authorization scope may be introduced in the future.
             * Each element must be a valid PartyIdString (as described in ``value.proto``).
             * Required, must be non-empty.
             */
            actAs?: string[];
            /**
             * Set of parties on whose behalf (in addition to all parties listed in ``act_as``) contracts can be retrieved.
             * This affects Daml operations such as ``fetch``, ``fetchByKey``, ``lookupByKey``, ``exercise``, and ``exerciseByKey``.
             * Note: A command can only use contracts that are visible to at least
             * one of the parties in ``act_as`` or ``read_as``. This visibility check is independent from the Daml authorization
             * rules for fetch operations.
             * If ledger API authorization is enabled, then the authorization metadata must authorize the sender of the request
             * to read contract data on behalf of each of the given parties.
             * Optional
             */
            readAs?: string[];
            /**
             * Additional contracts used to resolve contract & contract key lookups.
             * Optional
             */
            disclosedContracts?: /**
             * DisclosedContract
             * An additional contract that is used to resolve
             * contract & contract key lookups.
             */
            DisclosedContract[];
            /**
             * Must be a valid synchronizer id
             * Required
             */
            synchronizerId: string;
            /**
             * The package-id selection preference of the client for resolving
             * package names and interface instances in command submission and interpretation
             */
            packageIdSelectionPreference?: string[];
            /**
             * When true, the response will contain additional details on how the transaction was encoded and hashed
             * This can be useful for troubleshooting of hash mismatches. Should only be used for debugging.
             */
            verboseHashing: boolean;
            /**
             * Fetches the contract keys into the caches to speed up the command processing.
             * Should only contain contract keys that are expected to be resolved during interpretation of the commands.
             * Keys of disclosed contracts do not need prefetching.
             *
             * Optional
             */
            prefetchContractKeys?: /**
             * PrefetchContractKey
             * Preload contracts
             */
            PrefetchContractKey[];
        }
        /**
         * JsPrepareSubmissionResponse
         * [docs-entry-end: HashingSchemeVersion]
         */
        export interface JsPrepareSubmissionResponse {
            /**
             * The interpreted transaction, it represents the ledger changes necessary to execute the commands specified in the request.
             * Clients MUST display the content of the transaction to the user for them to validate before signing the hash if the preparing participant is not trusted.
             */
            preparedTransaction?: string;
            /**
             * Hash of the transaction, this is what needs to be signed by the party to authorize the transaction.
             * Only provided for convenience, clients MUST recompute the hash from the raw transaction if the preparing participant is not trusted.
             * May be removed in future versions
             */
            preparedTransactionHash: string;
            /**
             * The hashing scheme version used when building the hash
             */
            hashingSchemeVersion: string;
            /**
             * Optional additional details on how the transaction was encoded and hashed. Only set if verbose_hashing = true in the request
             * Note that there are no guarantees on the stability of the format or content of this field.
             * Its content should NOT be parsed and should only be used for troubleshooting purposes.
             */
            hashingDetails?: string;
        }
        /**
         * JsReassignment
         * Complete view of an on-ledger reassignment.
         */
        export interface JsReassignment {
            /**
             * Assigned by the server. Useful for correlating logs.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            updateId: string;
            /**
             * The ID of the command which resulted in this reassignment. Missing for everyone except the submitting party on the submitting participant.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            commandId: string;
            /**
             * The workflow ID used in reassignment command submission. Only set if the ``workflow_id`` for the command was set.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            workflowId: string;
            /**
             * The participant's offset. The details of this field are described in ``community/ledger-api/README.md``.
             * Required, must be a valid absolute offset (positive integer).
             */
            offset: number; // int64
            /**
             * The collection of reassignment events. Required.
             */
            events?: /* JsReassignmentEvent */ JsReassignmentEvent[];
            /**
             * Optional; ledger API trace context
             *
             * The trace context transported in this message corresponds to the trace context supplied
             * by the client application in a HTTP2 header of the original command submission.
             * We typically use a header to transfer this type of information. Here we use message
             * body, because it is used in gRPC streams which do not support per message headers.
             * This field will be populated with the trace context contained in the original submission.
             * If that was not provided, a unique ledger-api-server generated trace context will be used
             * instead.
             */
            traceContext?: /* TraceContext */ TraceContext;
            /**
             * The time at which the reassignment was recorded. The record time refers to the source/target
             * synchronizer for an unassign/assign event respectively.
             * Required
             */
            recordTime: string;
        }
        /**
         * JsReassignmentEvent
         */
        export type JsReassignmentEvent = /* JsReassignmentEvent */ {
            JsAssignmentEvent: /* JsAssignmentEvent */ JsAssignmentEvent;
        } | {
            JsUnassignedEvent: /**
             * JsUnassignedEvent
             * Records that a contract has been unassigned, and it becomes unusable on the source synchronizer
             */
            JsUnassignedEvent;
        };
        /**
         * JsStatus
         */
        export interface JsStatus {
            code: number; // int32
            message: string;
            details?: /* ProtoAny */ ProtoAny[];
        }
        /**
         * JsSubmitAndWaitForReassignmentResponse
         */
        export interface JsSubmitAndWaitForReassignmentResponse {
            /**
             * The reassignment that resulted from the submitted reassignment command.
             * The reassignment might contain no events (request conditions result in filtering out all of them).
             * Required
             */
            reassignment: /**
             * JsReassignment
             * Complete view of an on-ledger reassignment.
             */
            JsReassignment;
        }
        /**
         * JsSubmitAndWaitForTransactionRequest
         * These commands are executed as a single atomic transaction.
         */
        export interface JsSubmitAndWaitForTransactionRequest {
            /**
             * The commands to be submitted.
             * Required
             */
            commands: /**
             * JsCommands
             * A composite command that groups multiple commands together.
             */
            JsCommands;
            /**
             * If no ``transaction_format`` is provided, a default will be used where ``transaction_shape`` is set to
             * TRANSACTION_SHAPE_ACS_DELTA, ``event_format`` is defined with ``filters_by_party`` containing wildcard-template
             * filter for all original ``act_as`` and ``read_as`` parties and the ``verbose`` flag is set.
             * Optional
             */
            transactionFormat?: /**
             * TransactionFormat
             * A format that specifies what events to include in Daml transactions
             * and what data to compute and include for them.
             */
            TransactionFormat;
        }
        /**
         * JsSubmitAndWaitForTransactionResponse
         */
        export interface JsSubmitAndWaitForTransactionResponse {
            /**
             * The transaction that resulted from the submitted command.
             * The transaction might contain no events (request conditions result in filtering out all of them).
             * Required
             */
            transaction: /**
             * JsTransaction
             * Filtered view of an on-ledger transaction's create and archive events.
             */
            JsTransaction;
        }
        /**
         * JsSubmitAndWaitForTransactionTreeResponse
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         */
        export interface JsSubmitAndWaitForTransactionTreeResponse {
            transactionTree: /**
             * JsTransactionTree
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Complete view of an on-ledger transaction.
             */
            JsTransactionTree;
        }
        /**
         * JsTopologyTransaction
         */
        export interface JsTopologyTransaction {
            /**
             * Assigned by the server. Useful for correlating logs.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            updateId: string;
            /**
             * The absolute offset. The details of this field are described in ``community/ledger-api/README.md``.
             * Required, it is a valid absolute offset (positive integer).
             */
            offset: number; // int64
            /**
             * A valid synchronizer id.
             * Identifies the synchronizer that synchronized the topology transaction.
             * Required
             */
            synchronizerId: string;
            /**
             * The time at which the changes in the topology transaction become effective. There is a small delay between a
             * topology transaction being sequenced and the changes it contains becoming effective. Topology transactions appear
             * in order relative to a synchronizer based on their effective time rather than their sequencing time.
             * Required
             */
            recordTime?: string;
            /**
             * A non-empty list of topology events.
             * Required
             */
            events?: /* TopologyEvent */ TopologyEvent[];
            /**
             * Optional; ledger API trace context
             *
             * The trace context transported in this message corresponds to the trace context supplied
             * by the client application in a HTTP2 header of the original command submission.
             * We typically use a header to transfer this type of information. Here we use message
             * body, because it is used in gRPC streams which do not support per message headers.
             * This field will be populated with the trace context contained in the original submission.
             * If that was not provided, a unique ledger-api-server generated trace context will be used
             * instead.
             */
            traceContext?: /* TraceContext */ TraceContext;
        }
        /**
         * JsTransaction
         * Filtered view of an on-ledger transaction's create and archive events.
         */
        export interface JsTransaction {
            /**
             * Assigned by the server. Useful for correlating logs.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            updateId: string;
            /**
             * The ID of the command which resulted in this transaction. Missing for everyone except the submitting party.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            commandId: string;
            /**
             * The workflow ID used in command submission.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            workflowId: string;
            /**
             * Ledger effective time.
             * Required
             */
            effectiveAt: string;
            /**
             * The collection of events.
             * Contains:
             *
             * - ``CreatedEvent`` or ``ArchivedEvent`` in case of ACS_DELTA transaction shape
             * - ``CreatedEvent`` or ``ExercisedEvent`` in case of LEDGER_EFFECTS transaction shape
             *
             * Required
             */
            events?: /**
             * Event
             * Events in transactions can have two primary shapes:
             *
             * - ACS delta: events can be CreatedEvent or ArchivedEvent
             * - ledger effects: events can be CreatedEvent or ExercisedEvent
             *
             * In the update service the events are restricted to the events
             * visible for the parties specified in the transaction filter. Each
             * event message type below contains a ``witness_parties`` field which
             * indicates the subset of the requested parties that can see the event
             * in question.
             */
            Event[];
            /**
             * The absolute offset. The details of this field are described in ``community/ledger-api/README.md``.
             * Required, it is a valid absolute offset (positive integer).
             */
            offset: number; // int64
            /**
             * A valid synchronizer id.
             * Identifies the synchronizer that synchronized the transaction.
             * Required
             */
            synchronizerId: string;
            /**
             * Optional; ledger API trace context
             *
             * The trace context transported in this message corresponds to the trace context supplied
             * by the client application in a HTTP2 header of the original command submission.
             * We typically use a header to transfer this type of information. Here we use message
             * body, because it is used in gRPC streams which do not support per message headers.
             * This field will be populated with the trace context contained in the original submission.
             * If that was not provided, a unique ledger-api-server generated trace context will be used
             * instead.
             */
            traceContext?: /* TraceContext */ TraceContext;
            /**
             * The time at which the transaction was recorded. The record time refers to the synchronizer
             * which synchronized the transaction.
             * Required
             */
            recordTime: string;
            /**
             * For transaction externally signed, contains the external transaction hash
             * signed by the external party. Can be used to correlate an external submission with a committed transaction.
             * Optional
             */
            externalTransactionHash?: string;
        }
        /**
         * JsTransactionTree
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         * Complete view of an on-ledger transaction.
         */
        export interface JsTransactionTree {
            /**
             * Assigned by the server. Useful for correlating logs.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            updateId: string;
            /**
             * The ID of the command which resulted in this transaction. Missing for everyone except the submitting party.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            commandId: string;
            /**
             * The workflow ID used in command submission. Only set if the ``workflow_id`` for the command was set.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            workflowId: string;
            /**
             * Ledger effective time.
             * Required
             */
            effectiveAt?: string;
            /**
             * The absolute offset. The details of this field are described in ``community/ledger-api/README.md``.
             * Required, it is a valid absolute offset (positive integer).
             */
            offset: number; // int64
            /**
             * Changes to the ledger that were caused by this transaction. Nodes of the transaction tree.
             * Each key must be a valid node ID (non-negative integer).
             * Required
             */
            eventsById: /* Map_Int_TreeEvent */ MapIntTreeEvent;
            /**
             * A valid synchronizer id.
             * Identifies the synchronizer that synchronized the transaction.
             * Required
             */
            synchronizerId: string;
            /**
             * Optional; ledger API trace context
             *
             * The trace context transported in this message corresponds to the trace context supplied
             * by the client application in a HTTP2 header of the original command submission.
             * We typically use a header to transfer this type of information. Here we use message
             * body, because it is used in gRPC streams which do not support per message headers.
             * This field will be populated with the trace context contained in the original submission.
             * If that was not provided, a unique ledger-api-server generated trace context will be used
             * instead.
             */
            traceContext?: /* TraceContext */ TraceContext;
            /**
             * The time at which the transaction was recorded. The record time refers to the synchronizer
             * which synchronized the transaction.
             * Required
             */
            recordTime: string;
        }
        /**
         * JsUnassignedEvent
         * Records that a contract has been unassigned, and it becomes unusable on the source synchronizer
         */
        export interface JsUnassignedEvent {
            value: /**
             * UnassignedEvent
             * Records that a contract has been unassigned, and it becomes unusable on the source synchronizer
             */
            UnassignedEvent;
        }
        /**
         * Kind
         * Required
         */
        export type Kind = /**
         * Kind
         * Required
         */
        {
            CanActAs: /* CanActAs */ CanActAs;
        } | {
            CanReadAs: /* CanReadAs */ CanReadAs;
        } | {
            CanReadAsAnyParty: /* CanReadAsAnyParty */ CanReadAsAnyParty;
        } | {
            Empty: /* Empty */ Empty6;
        } | {
            IdentityProviderAdmin: /* IdentityProviderAdmin */ IdentityProviderAdmin;
        } | {
            ParticipantAdmin: /* ParticipantAdmin */ ParticipantAdmin;
        };
        /**
         * ListIdentityProviderConfigsResponse
         */
        export interface ListIdentityProviderConfigsResponse {
            /**
             *
             */
            identityProviderConfigs?: /* IdentityProviderConfig */ IdentityProviderConfig[];
        }
        /**
         * ListKnownPartiesResponse
         */
        export interface ListKnownPartiesResponse {
            /**
             * The details of all Daml parties known by the participant.
             * Required
             */
            partyDetails?: /* PartyDetails */ PartyDetails[];
            /**
             * Pagination token to retrieve the next page.
             * Empty, if there are no further results.
             */
            nextPageToken: string;
        }
        /**
         * ListPackagesResponse
         */
        export interface ListPackagesResponse {
            /**
             * The IDs of all Daml-LF packages supported by the server.
             * Each element must be a valid PackageIdString (as described in ``value.proto``).
             * Required
             */
            packageIds?: string[];
        }
        /**
         * ListUserRightsResponse
         */
        export interface ListUserRightsResponse {
            /**
             * All rights of the user.
             */
            rights?: /**
             * Right
             * A right granted to a user.
             */
            Right[];
        }
        /**
         * ListUsersResponse
         */
        export interface ListUsersResponse {
            /**
             * A subset of users of the participant node that fit into this page.
             */
            users?: /**
             * User
             *  Users and rights
             * /////////////////
             *  Users are used to dynamically manage the rights given to Daml applications.
             *  They are stored and managed per participant node.
             */
            User[];
            /**
             * Pagination token to retrieve the next page.
             * Empty, if there are no further results.
             */
            nextPageToken: string;
        }
        /**
         * Map_Filters
         */
        export interface MapFilters {
            [name: string]: /**
             * Filters
             * The union of a set of template filters, interface filters, or a wildcard.
             */
            Filters;
        }
        /**
         * Map_Int_Field
         */
        export interface MapIntField {
            [name: string]: /* Field */ Field;
        }
        /**
         * Map_Int_TreeEvent
         */
        export interface MapIntTreeEvent {
            [name: string]: /**
             * TreeEvent
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Each tree event message type below contains a ``witness_parties`` field which
             * indicates the subset of the requested parties that can see the event
             * in question.
             *
             * Note that transaction trees might contain events with
             * _no_ witness parties, which were included simply because they were
             * children of events which have witnesses.
             */
            TreeEvent;
        }
        /**
         * Map_String
         */
        export interface MapString {
            [name: string]: string;
        }
        /**
         * MinLedgerTime
         */
        export interface MinLedgerTime {
            time: /* Time */ Time;
        }
        /**
         * MinLedgerTimeAbs
         */
        export interface MinLedgerTimeAbs {
            value: string;
        }
        /**
         * MinLedgerTimeRel
         */
        export interface MinLedgerTimeRel {
            value: /* Duration */ Duration;
        }
        /**
         * ObjectMeta
         * Represents metadata corresponding to a participant resource (e.g. a participant user or participant local information about a party).
         *
         * Based on ``ObjectMeta`` meta used in Kubernetes API.
         * See https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/generated.proto#L640
         */
        export interface ObjectMeta {
            /**
             * An opaque, non-empty value, populated by a participant server which represents the internal version of the resource
             * this ``ObjectMeta`` message is attached to. The participant server will change it to a unique value each time the corresponding resource is updated.
             * You must not rely on the format of resource version. The participant server might change it without notice.
             * You can obtain the newest resource version value by issuing a read request.
             * You may use it for concurrent change detection by passing it back unmodified in an update request.
             * The participant server will then compare the passed value with the value maintained by the system to determine
             * if any other updates took place since you had read the resource version.
             * Upon a successful update you are guaranteed that no other update took place during your read-modify-write sequence.
             * However, if another update took place during your read-modify-write sequence then your update will fail with an appropriate error.
             * Concurrent change control is optional. It will be applied only if you include a resource version in an update request.
             * When creating a new instance of a resource you must leave the resource version empty.
             * Its value will be populated by the participant server upon successful resource creation.
             * Optional
             */
            resourceVersion: string;
            /**
             * A set of modifiable key-value pairs that can be used to represent arbitrary, client-specific metadata.
             * Constraints:
             *
             * 1. The total size over all keys and values cannot exceed 256kb in UTF-8 encoding.
             * 2. Keys are composed of an optional prefix segment and a required name segment such that:
             *
             *    - key prefix, when present, must be a valid DNS subdomain with at most 253 characters, followed by a '/' (forward slash) character,
             *    - name segment must have at most 63 characters that are either alphanumeric ([a-z0-9A-Z]), or a '.' (dot), '-' (dash) or '_' (underscore);
             *      and it must start and end with an alphanumeric character.
             *
             * 3. Values can be any non-empty strings.
             *
             * Keys with empty prefix are reserved for end-users.
             * Properties set by external tools or internally by the participant server must use non-empty key prefixes.
             * Duplicate keys are disallowed by the semantics of the protobuf3 maps.
             * See: https://developers.google.com/protocol-buffers/docs/proto3#maps
             * Annotations may be a part of a modifiable resource.
             * Use the resource's update RPC to update its annotations.
             * In order to add a new annotation or update an existing one using an update RPC, provide the desired annotation in the update request.
             * In order to remove an annotation using an update RPC, provide the target annotation's key but set its value to the empty string in the update request.
             * Optional
             * Modifiable
             */
            annotations: /* Map_String */ MapString;
        }
        /**
         * OffsetCheckpoint
         * OffsetCheckpoints may be used to:
         *
         * - detect time out of commands.
         * - provide an offset which can be used to restart consumption.
         */
        export interface OffsetCheckpoint {
            value: /**
             * OffsetCheckpoint
             * OffsetCheckpoints may be used to:
             *
             * - detect time out of commands.
             * - provide an offset which can be used to restart consumption.
             */
            OffsetCheckpoint1;
        }
        /**
         * OffsetCheckpoint
         * OffsetCheckpoints may be used to:
         *
         * - detect time out of commands.
         * - provide an offset which can be used to restart consumption.
         */
        export interface OffsetCheckpoint1 {
            /**
             * The participant's offset, the details of the offset field are described in ``community/ledger-api/README.md``.
             * Required, must be a valid absolute offset (positive integer).
             */
            offset: number; // int64
            /**
             *
             */
            synchronizerTimes?: /* SynchronizerTime */ SynchronizerTime[];
        }
        /**
         * OffsetCheckpoint
         * OffsetCheckpoints may be used to:
         *
         * - detect time out of commands.
         * - provide an offset which can be used to restart consumption.
         */
        export interface OffsetCheckpoint2 {
            value: /**
             * OffsetCheckpoint
             * OffsetCheckpoints may be used to:
             *
             * - detect time out of commands.
             * - provide an offset which can be used to restart consumption.
             */
            OffsetCheckpoint1;
        }
        /**
         * OffsetCheckpoint
         * OffsetCheckpoints may be used to:
         *
         * - detect time out of commands.
         * - provide an offset which can be used to restart consumption.
         */
        export interface OffsetCheckpoint3 {
            value: /**
             * OffsetCheckpoint
             * OffsetCheckpoints may be used to:
             *
             * - detect time out of commands.
             * - provide an offset which can be used to restart consumption.
             */
            OffsetCheckpoint1;
        }
        /**
         * OffsetCheckpointFeature
         */
        export interface OffsetCheckpointFeature {
            /**
             * The maximum delay to emmit a new OffsetCheckpoint if it exists
             */
            maxOffsetCheckpointEmissionDelay?: /* Duration */ Duration;
        }
        /**
         * PackagePreference
         */
        export interface PackagePreference {
            /**
             * The package reference of the preferred package.
             * Required
             */
            packageReference?: /* PackageReference */ PackageReference;
            /**
             * The synchronizer for which the preferred package was computed.
             * If the synchronizer_id was specified in the request, then it matches the request synchronizer_id.
             * Required
             */
            synchronizerId: string;
        }
        /**
         * PackageReference
         */
        export interface PackageReference {
            /**
             * Required
             */
            packageId: string;
            /**
             * Required
             */
            packageName: string;
            /**
             * Required
             */
            packageVersion: string;
        }
        /**
         * PackageVettingRequirement
         * Defines a package-name for which the commonly vetted package with the highest version must be found.
         */
        export interface PackageVettingRequirement {
            /**
             * The parties whose participants' vetting state should be considered when resolving the preferred package.
             * Required
             */
            parties?: string[];
            /**
             * The package-name for which the preferred package should be resolved.
             * Required
             */
            packageName: string;
        }
        /**
         * ParticipantAdmin
         */
        export interface ParticipantAdmin {
            value: /* ParticipantAdmin */ ParticipantAdmin1;
        }
        /**
         * ParticipantAdmin
         */
        export interface ParticipantAdmin1 {
        }
        /**
         * ParticipantAuthorizationAdded
         */
        export interface ParticipantAuthorizationAdded {
            value: /* ParticipantAuthorizationAdded */ ParticipantAuthorizationAdded1;
        }
        /**
         * ParticipantAuthorizationAdded
         */
        export interface ParticipantAuthorizationAdded1 {
            /**
             * Required
             */
            partyId: string;
            /**
             * Required
             */
            participantId: string;
            /**
             * Required
             */
            participantPermission: string;
        }
        /**
         * ParticipantAuthorizationChanged
         */
        export interface ParticipantAuthorizationChanged {
            value: /* ParticipantAuthorizationChanged */ ParticipantAuthorizationChanged1;
        }
        /**
         * ParticipantAuthorizationChanged
         */
        export interface ParticipantAuthorizationChanged1 {
            /**
             * Required
             */
            partyId: string;
            /**
             * Required
             */
            participantId: string;
            /**
             * Required
             */
            participantPermission: string;
        }
        /**
         * ParticipantAuthorizationRevoked
         */
        export interface ParticipantAuthorizationRevoked {
            value: /* ParticipantAuthorizationRevoked */ ParticipantAuthorizationRevoked1;
        }
        /**
         * ParticipantAuthorizationRevoked
         */
        export interface ParticipantAuthorizationRevoked1 {
            /**
             * Required
             */
            partyId: string;
            /**
             * Required
             */
            participantId: string;
        }
        /**
         * ParticipantAuthorizationTopologyFormat
         * A format specifying which participant authorization topology transactions to include and how to render them.
         */
        export interface ParticipantAuthorizationTopologyFormat {
            /**
             * List of parties for which the topology transactions should be sent.
             * Empty means: for all parties.
             */
            parties?: string[];
        }
        /**
         * PartyDetails
         */
        export interface PartyDetails {
            /**
             * The stable unique identifier of a Daml party.
             * Must be a valid PartyIdString (as described in ``value.proto``).
             * Required
             */
            party: string;
            /**
             * true if party is hosted by the participant and the party shares the same identity provider as the user issuing the request.
             * Optional
             */
            isLocal: boolean;
            /**
             * Participant-local metadata of this party.
             * Optional,
             * Modifiable
             */
            localMetadata?: /**
             * ObjectMeta
             * Represents metadata corresponding to a participant resource (e.g. a participant user or participant local information about a party).
             *
             * Based on ``ObjectMeta`` meta used in Kubernetes API.
             * See https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/generated.proto#L640
             */
            ObjectMeta;
            /**
             * The id of the ``Identity Provider``
             * Optional, if not set, there could be 3 options:
             *
             * 1. the party is managed by the default identity provider.
             * 2. party is not hosted by the participant.
             * 3. party is hosted by the participant, but is outside of the user's identity provider.
             */
            identityProviderId: string;
        }
        /**
         * PartyManagementFeature
         */
        export interface PartyManagementFeature {
            /**
             * The maximum number of parties the server can return in a single response (page).
             */
            maxPartiesPageSize: number; // int32
        }
        /**
         * PartySignatures
         * Additional signatures provided by the submitting parties
         */
        export interface PartySignatures {
            /**
             * Additional signatures provided by all individual parties
             */
            signatures?: /**
             * SinglePartySignatures
             * Signatures provided by a single party
             */
            SinglePartySignatures[];
        }
        /**
         * PrefetchContractKey
         * Preload contracts
         */
        export interface PrefetchContractKey {
            /**
             * The template of contract the client wants to prefetch.
             * Both package-name and package-id reference identifier formats for the template-id are supported.
             * Note: The package-id reference identifier format is deprecated. We plan to end support for this format in version 3.4.
             *
             * Required
             */
            templateId?: string;
            /**
             * The key of the contract the client wants to prefetch.
             * Required
             */
            contractKey: any;
        }
        /**
         * ProtoAny
         */
        export interface ProtoAny {
            typeUrl: string;
            value: string;
            unknownFields: /* UnknownFieldSet */ UnknownFieldSet;
        }
        /**
         * Reassignment
         * Complete view of an on-ledger reassignment.
         */
        export interface Reassignment {
            value: /**
             * JsReassignment
             * Complete view of an on-ledger reassignment.
             */
            JsReassignment;
        }
        /**
         * Reassignment
         * Complete view of an on-ledger reassignment.
         */
        export interface Reassignment1 {
            value: /**
             * JsReassignment
             * Complete view of an on-ledger reassignment.
             */
            JsReassignment;
        }
        /**
         * ReassignmentCommand
         */
        export interface ReassignmentCommand {
            command: /**
             * Command
             * A command can either create a new contract or exercise a choice on an existing contract.
             */
            Command1;
        }
        /**
         * ReassignmentCommands
         */
        export interface ReassignmentCommands {
            /**
             * Identifier of the on-ledger workflow that this command is a part of.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Optional
             */
            workflowId: string;
            /**
             * Uniquely identifies the participant user that issued the command.
             * Must be a valid UserIdString (as described in ``value.proto``).
             * Required unless authentication is used with a user token.
             * In that case, the token's user-id will be used for the request's user_id.
             */
            userId: string;
            /**
             * Uniquely identifies the command.
             * The triple (user_id, submitter, command_id) constitutes the change ID for the intended ledger change.
             * The change ID can be used for matching the intended ledger changes with all their completions.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            commandId: string;
            /**
             * Party on whose behalf the command should be executed.
             * If ledger API authorization is enabled, then the authorization metadata must authorize the sender of the request
             * to act on behalf of the given party.
             * Must be a valid PartyIdString (as described in ``value.proto``).
             * Required
             */
            submitter: string;
            /**
             * A unique identifier to distinguish completions for different submissions with the same change ID.
             * Typically a random UUID. Applications are expected to use a different UUID for each retry of a submission
             * with the same change ID.
             * Must be a valid LedgerString (as described in ``value.proto``).
             *
             * If omitted, the participant or the committer may set a value of their choice.
             * Optional
             */
            submissionId: string;
            /**
             * Individual elements of this reassignment. Must be non-empty.
             */
            commands?: /* ReassignmentCommand */ ReassignmentCommand[];
        }
        /**
         * RevokeUserRightsRequest
         * Remove the rights from the set of rights granted to the user.
         *
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(identity_provider_id)``
         */
        export interface RevokeUserRightsRequest {
            /**
             * The user from whom to revoke rights.
             * Required
             */
            userId: string;
            /**
             * The rights to revoke.
             * Optional
             */
            rights?: /**
             * Right
             * A right granted to a user.
             */
            Right[];
            /**
             * The id of the ``Identity Provider``
             * Optional, if not set, assume the user is managed by the default identity provider.
             */
            identityProviderId: string;
        }
        /**
         * RevokeUserRightsResponse
         */
        export interface RevokeUserRightsResponse {
            /**
             * The rights that were actually revoked by the request.
             */
            newlyRevokedRights?: /**
             * Right
             * A right granted to a user.
             */
            Right[];
        }
        /**
         * Right
         * A right granted to a user.
         */
        export interface Right {
            kind: /**
             * Kind
             * Required
             */
            Kind;
        }
        /**
         * Signature
         */
        export interface Signature {
            /**
             *
             */
            format: string;
            /**
             *
             */
            signature: string;
            /**
             * The fingerprint/id of the keypair used to create this signature and needed to verify.
             */
            signedBy: string;
            /**
             * The signing algorithm specification used to produce this signature
             */
            signingAlgorithmSpec: string;
        }
        /**
         * SinglePartySignatures
         * Signatures provided by a single party
         */
        export interface SinglePartySignatures {
            /**
             * Submitting party
             */
            party: string;
            /**
             * Signatures
             */
            signatures?: /* Signature */ Signature[];
        }
        /**
         * SubmitAndWaitForReassignmentRequest
         * This reassignment is executed as a single atomic update.
         */
        export interface SubmitAndWaitForReassignmentRequest {
            /**
             * The reassignment commands to be submitted.
             * Required
             */
            reassignmentCommands?: /* ReassignmentCommands */ ReassignmentCommands;
            /**
             * Optional
             * If no event_format provided, the result will contain no events.
             * The events in the result, will take shape TRANSACTION_SHAPE_ACS_DELTA.
             */
            eventFormat?: /**
             * EventFormat
             * A format for events which defines both which events should be included
             * and what data should be computed and included for them.
             *
             * Note that some of the filtering behavior depends on the `TransactionShape`,
             * which is expected to be specified alongside usages of `EventFormat`.
             */
            EventFormat;
        }
        /**
         * SubmitAndWaitResponse
         */
        export interface SubmitAndWaitResponse {
            /**
             * The id of the transaction that resulted from the submitted command.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            updateId: string;
            /**
             * The details of the offset field are described in ``community/ledger-api/README.md``.
             * Required
             */
            completionOffset: number; // int64
        }
        /**
         * SubmitReassignmentRequest
         */
        export interface SubmitReassignmentRequest {
            /**
             * The reassignment command to be submitted.
             * Required
             */
            reassignmentCommands?: /* ReassignmentCommands */ ReassignmentCommands;
        }
        /**
         * SubmitReassignmentResponse
         */
        export interface SubmitReassignmentResponse {
        }
        /**
         * SubmitResponse
         */
        export interface SubmitResponse {
        }
        /**
         * SynchronizerTime
         */
        export interface SynchronizerTime {
            /**
             * The id of the synchronizer.
             * Required
             */
            synchronizerId: string;
            /**
             * All commands with a maximum record time below this value MUST be considered lost if their completion has not arrived before this checkpoint.
             * Required
             */
            recordTime?: string;
        }
        /**
         * TemplateFilter
         * This filter matches contracts of a specific template.
         */
        export interface TemplateFilter {
            value: /**
             * TemplateFilter
             * This filter matches contracts of a specific template.
             */
            TemplateFilter1;
        }
        /**
         * TemplateFilter
         * This filter matches contracts of a specific template.
         */
        export interface TemplateFilter1 {
            /**
             * A template for which the payload should be included in the response.
             * The ``template_id`` needs to be valid: corresponding template should be defined in
             * one of the available packages at the time of the query.
             * Both package-name and package-id reference formats for the identifier are supported.
             * Note: The package-id reference identifier format is deprecated. We plan to end support for this format in version 3.4.
             *
             * Required
             */
            templateId?: string;
            /**
             * Whether to include a ``created_event_blob`` in the returned ``CreatedEvent``.
             * Use this to access the contract event payload in your API client
             * for submitting it as a disclosed contract with future commands.
             * Optional
             */
            includeCreatedEventBlob: boolean;
        }
        /**
         * Time
         */
        export type Time = /* Time */ {
            Empty: /* Empty */ Empty7;
        } | {
            MinLedgerTimeAbs: /* MinLedgerTimeAbs */ MinLedgerTimeAbs;
        } | {
            MinLedgerTimeRel: /* MinLedgerTimeRel */ MinLedgerTimeRel;
        };
        /**
         * TopologyEvent
         */
        export interface TopologyEvent {
            event: /* TopologyEventEvent */ TopologyEventEvent;
        }
        /**
         * TopologyEventEvent
         */
        export type TopologyEventEvent = /* TopologyEventEvent */ {
            Empty: /* Empty */ Empty5;
        } | {
            ParticipantAuthorizationAdded: /* ParticipantAuthorizationAdded */ ParticipantAuthorizationAdded;
        } | {
            ParticipantAuthorizationChanged: /* ParticipantAuthorizationChanged */ ParticipantAuthorizationChanged;
        } | {
            ParticipantAuthorizationRevoked: /* ParticipantAuthorizationRevoked */ ParticipantAuthorizationRevoked;
        };
        /**
         * TopologyFormat
         * A format specifying which topology transactions to include and how to render them.
         */
        export interface TopologyFormat {
            /**
             * Include participant authorization topology events in streams.
             * Optional, if unset no participant authorization topology events are emitted in the stream.
             */
            includeParticipantAuthorizationEvents?: /**
             * ParticipantAuthorizationTopologyFormat
             * A format specifying which participant authorization topology transactions to include and how to render them.
             */
            ParticipantAuthorizationTopologyFormat;
        }
        /**
         * TopologyTransaction
         */
        export interface TopologyTransaction {
            value: /* JsTopologyTransaction */ JsTopologyTransaction;
        }
        /**
         * TraceContext
         */
        export interface TraceContext {
            /**
             * https://www.w3.org/TR/trace-context/
             */
            traceparent?: string;
            /**
             *
             */
            tracestate?: string;
        }
        /**
         * Transaction
         * Filtered view of an on-ledger transaction's create and archive events.
         */
        export interface Transaction {
            value: /**
             * JsTransaction
             * Filtered view of an on-ledger transaction's create and archive events.
             */
            JsTransaction;
        }
        /**
         * TransactionFilter
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         * Used both for filtering create and archive events as well as for filtering transaction trees.
         */
        export interface TransactionFilter {
            /**
             * Each key must be a valid PartyIdString (as described in ``value.proto``).
             * The interpretation of the filter depends on the transaction-shape being filtered:
             *
             * 1. For **transaction trees** (used in GetUpdateTreesResponse for backwards compatibility) all party keys used as
             *    wildcard filters, and all subtrees whose root has one of the listed parties as an informee are returned.
             *    If there are ``CumulativeFilter``s, those will control returned ``CreatedEvent`` fields where applicable, but will
             *    not be used for template/interface filtering.
             * 2. For **ledger-effects** create and exercise events are returned, for which the witnesses include at least one of
             *    the listed parties and match the per-party filter.
             * 3. For **transaction and active-contract-set streams** create and archive events are returned for all contracts whose
             *    stakeholders include at least one of the listed parties and match the per-party filter.
             *
             * Required
             */
            filtersByParty: /* Map_Filters */ MapFilters;
            /**
             * Wildcard filters that apply to all the parties existing on the participant. The interpretation of the filters is the same
             * with the per-party filter as described above.
             */
            filtersForAnyParty?: /**
             * Filters
             * The union of a set of template filters, interface filters, or a wildcard.
             */
            Filters;
        }
        /**
         * TransactionFormat
         * A format that specifies what events to include in Daml transactions
         * and what data to compute and include for them.
         */
        export interface TransactionFormat {
            /**
             * Required
             */
            eventFormat?: /**
             * EventFormat
             * A format for events which defines both which events should be included
             * and what data should be computed and included for them.
             *
             * Note that some of the filtering behavior depends on the `TransactionShape`,
             * which is expected to be specified alongside usages of `EventFormat`.
             */
            EventFormat;
            /**
             * What transaction shape to use for interpreting the filters of the event format.
             * Required
             */
            transactionShape: string;
        }
        /**
         * TransactionTree
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         * Complete view of an on-ledger transaction.
         */
        export interface TransactionTree {
            value: /**
             * JsTransactionTree
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Complete view of an on-ledger transaction.
             */
            JsTransactionTree;
        }
        /**
         * TreeEvent
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         * Each tree event message type below contains a ``witness_parties`` field which
         * indicates the subset of the requested parties that can see the event
         * in question.
         *
         * Note that transaction trees might contain events with
         * _no_ witness parties, which were included simply because they were
         * children of events which have witnesses.
         */
        export type TreeEvent = /**
         * TreeEvent
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         * Each tree event message type below contains a ``witness_parties`` field which
         * indicates the subset of the requested parties that can see the event
         * in question.
         *
         * Note that transaction trees might contain events with
         * _no_ witness parties, which were included simply because they were
         * children of events which have witnesses.
         */
        {
            CreatedTreeEvent: /* CreatedTreeEvent */ CreatedTreeEvent;
        } | {
            ExercisedTreeEvent: /* ExercisedTreeEvent */ ExercisedTreeEvent;
        };
        /**
         * Tuple2_String_String
         */
        export type Tuple2StringString = [
            string,
            string
        ];
        /**
         * UnassignCommand
         * Unassign a contract
         */
        export interface UnassignCommand {
            value: /**
             * UnassignCommand
             * Unassign a contract
             */
            UnassignCommand1;
        }
        /**
         * UnassignCommand
         * Unassign a contract
         */
        export interface UnassignCommand1 {
            /**
             * The ID of the contract the client wants to unassign.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            contractId: string;
            /**
             * The ID of the source synchronizer
             * Must be a valid synchronizer id
             * Required
             */
            source: string;
            /**
             * The ID of the target synchronizer
             * Must be a valid synchronizer id
             * Required
             */
            target: string;
        }
        /**
         * UnassignedEvent
         * Records that a contract has been unassigned, and it becomes unusable on the source synchronizer
         */
        export interface UnassignedEvent {
            /**
             * The ID of the unassignment. This needs to be used as an input for a assign ReassignmentCommand.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            reassignmentId: string;
            /**
             * The ID of the reassigned contract.
             * Must be a valid LedgerString (as described in ``value.proto``).
             * Required
             */
            contractId: string;
            /**
             * The template of the reassigned contract.
             * The identifier uses the package-id reference format.
             *
             * Required
             */
            templateId?: string;
            /**
             * The ID of the source synchronizer
             * Must be a valid synchronizer id
             * Required
             */
            source: string;
            /**
             * The ID of the target synchronizer
             * Must be a valid synchronizer id
             * Required
             */
            target: string;
            /**
             * Party on whose behalf the unassign command was executed.
             * Empty if the unassignment happened offline via the repair service.
             * Must be a valid PartyIdString (as described in ``value.proto``).
             * Optional
             */
            submitter: string;
            /**
             * Each corresponding assigned and unassigned event has the same reassignment_counter. This strictly increases
             * with each unassign command for the same contract. Creation of the contract corresponds to reassignment_counter
             * equals zero.
             * Required
             */
            reassignmentCounter: number; // int64
            /**
             * Assignment exclusivity
             * Before this time (measured on the target synchronizer), only the submitter of the unassignment can initiate the assignment
             * Defined for reassigning participants.
             * Optional
             */
            assignmentExclusivity?: string;
            /**
             * The parties that are notified of this event.
             * Required
             */
            witnessParties?: string[];
            /**
             * The package name of the contract.
             * Required
             */
            packageName: string;
            /**
             * The offset of origin.
             * Offsets are managed by the participant nodes.
             * Reassignments can thus NOT be assumed to have the same offsets on different participant nodes.
             * Required, it is a valid absolute offset (positive integer)
             */
            offset: number; // int64
            /**
             * The position of this event in the originating reassignment.
             * Node IDs are not necessarily equal across participants,
             * as these may see different projections/parts of reassignments.
             * Required, must be valid node ID (non-negative integer)
             */
            nodeId: number; // int32
        }
        /**
         * UnknownFieldSet
         */
        export interface UnknownFieldSet {
            fields: /* Map_Int_Field */ MapIntField;
        }
        /**
         * Update
         */
        export type Update = /* Update */ {
            OffsetCheckpoint: /**
             * OffsetCheckpoint
             * OffsetCheckpoints may be used to:
             *
             * - detect time out of commands.
             * - provide an offset which can be used to restart consumption.
             */
            OffsetCheckpoint2;
        } | {
            Reassignment: /**
             * Reassignment
             * Complete view of an on-ledger reassignment.
             */
            Reassignment;
        } | {
            TopologyTransaction: /* TopologyTransaction */ TopologyTransaction;
        } | {
            Transaction: /**
             * Transaction
             * Filtered view of an on-ledger transaction's create and archive events.
             */
            Transaction;
        };
        /**
         * Update
         * The update that matches the filter in the request.
         */
        export type Update1 = /**
         * Update
         * The update that matches the filter in the request.
         */
        {
            OffsetCheckpoint: /**
             * OffsetCheckpoint
             * OffsetCheckpoints may be used to:
             *
             * - detect time out of commands.
             * - provide an offset which can be used to restart consumption.
             */
            OffsetCheckpoint3;
        } | {
            Reassignment: /**
             * Reassignment
             * Complete view of an on-ledger reassignment.
             */
            Reassignment1;
        } | {
            TransactionTree: /**
             * TransactionTree
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             * Complete view of an on-ledger transaction.
             */
            TransactionTree;
        };
        /**
         * UpdateFormat
         * A format specifying what updates to include and how to render them.
         */
        export interface UpdateFormat {
            /**
             * Include Daml transactions in streams.
             * Optional, if unset, no transactions are emitted in the stream.
             */
            includeTransactions?: /**
             * TransactionFormat
             * A format that specifies what events to include in Daml transactions
             * and what data to compute and include for them.
             */
            TransactionFormat;
            /**
             * Include (un)assignments in the stream.
             * The events in the result take the shape TRANSACTION_SHAPE_ACS_DELTA.
             * Optional, if unset, no (un)assignments are emitted in the stream.
             */
            includeReassignments?: /**
             * EventFormat
             * A format for events which defines both which events should be included
             * and what data should be computed and included for them.
             *
             * Note that some of the filtering behavior depends on the `TransactionShape`,
             * which is expected to be specified alongside usages of `EventFormat`.
             */
            EventFormat;
            /**
             * Include topology events in streams.
             * Optional, if unset no topology events are emitted in the stream.
             */
            includeTopologyEvents?: /**
             * TopologyFormat
             * A format specifying which topology transactions to include and how to render them.
             */
            TopologyFormat;
        }
        /**
         * UpdateIdentityProviderConfigRequest
         */
        export interface UpdateIdentityProviderConfigRequest {
            /**
             * The identity provider config to update.
             * Required,
             * Modifiable
             */
            identityProviderConfig?: /* IdentityProviderConfig */ IdentityProviderConfig;
            /**
             * An update mask specifies how and which properties of the ``IdentityProviderConfig`` message are to be updated.
             * An update mask consists of a set of update paths.
             * A valid update path points to a field or a subfield relative to the ``IdentityProviderConfig`` message.
             * A valid update mask must:
             *
             * 1. contain at least one update path,
             * 2. contain only valid update paths.
             *
             * Fields that can be updated are marked as ``Modifiable``.
             * For additional information see the documentation for standard protobuf3's ``google.protobuf.FieldMask``.
             * Required
             */
            updateMask?: /* FieldMask */ FieldMask;
        }
        /**
         * UpdateIdentityProviderConfigResponse
         */
        export interface UpdateIdentityProviderConfigResponse {
            /**
             * Updated identity provider config
             */
            identityProviderConfig?: /* IdentityProviderConfig */ IdentityProviderConfig;
        }
        /**
         * UpdatePartyDetailsRequest
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(party_details.identity_provider_id)``
         */
        export interface UpdatePartyDetailsRequest {
            /**
             * Party to be updated
             * Required,
             * Modifiable
             */
            partyDetails?: /* PartyDetails */ PartyDetails;
            /**
             * An update mask specifies how and which properties of the ``PartyDetails`` message are to be updated.
             * An update mask consists of a set of update paths.
             * A valid update path points to a field or a subfield relative to the ``PartyDetails`` message.
             * A valid update mask must:
             *
             * 1. contain at least one update path,
             * 2. contain only valid update paths.
             *
             * Fields that can be updated are marked as ``Modifiable``.
             * An update path can also point to non-``Modifiable`` fields such as 'party' and 'local_metadata.resource_version'
             * because they are used:
             *
             * 1. to identify the party details resource subject to the update,
             * 2. for concurrent change control.
             *
             * An update path can also point to non-``Modifiable`` fields such as 'is_local'
             * as long as the values provided in the update request match the server values.
             * Examples of update paths: 'local_metadata.annotations', 'local_metadata'.
             * For additional information see the documentation for standard protobuf3's ``google.protobuf.FieldMask``.
             * For similar Ledger API see ``com.daml.ledger.api.v2.admin.UpdateUserRequest``.
             * Required
             */
            updateMask?: /* FieldMask */ FieldMask;
        }
        /**
         * UpdatePartyDetailsResponse
         */
        export interface UpdatePartyDetailsResponse {
            /**
             * Updated party details
             */
            partyDetails?: /* PartyDetails */ PartyDetails;
        }
        /**
         * UpdateUserIdentityProviderIdRequest
         * Required authorization: ``HasRight(ParticipantAdmin)``
         */
        export interface UpdateUserIdentityProviderIdRequest {
            /**
             * User to update
             */
            userId: string;
            /**
             * Current identity provider ID of the user
             */
            sourceIdentityProviderId: string;
            /**
             * Target identity provider ID of the user
             */
            targetIdentityProviderId: string;
        }
        /**
         * UpdateUserIdentityProviderIdResponse
         */
        export interface UpdateUserIdentityProviderIdResponse {
        }
        /**
         * UpdateUserRequest
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(user.identity_provider_id)``
         */
        export interface UpdateUserRequest {
            /**
             * The user to update.
             * Required,
             * Modifiable
             */
            user?: /**
             * User
             *  Users and rights
             * /////////////////
             *  Users are used to dynamically manage the rights given to Daml applications.
             *  They are stored and managed per participant node.
             */
            User;
            /**
             * An update mask specifies how and which properties of the ``User`` message are to be updated.
             * An update mask consists of a set of update paths.
             * A valid update path points to a field or a subfield relative to the ``User`` message.
             * A valid update mask must:
             *
             * 1. contain at least one update path,
             * 2. contain only valid update paths.
             *
             * Fields that can be updated are marked as ``Modifiable``.
             * An update path can also point to a non-``Modifiable`` fields such as 'id' and 'metadata.resource_version'
             * because they are used:
             *
             * 1. to identify the user resource subject to the update,
             * 2. for concurrent change control.
             *
             * Examples of valid update paths: 'primary_party', 'metadata', 'metadata.annotations'.
             * For additional information see the documentation for standard protobuf3's ``google.protobuf.FieldMask``.
             * For similar Ledger API see ``com.daml.ledger.api.v2.admin.UpdatePartyDetailsRequest``.
             * Required
             */
            updateMask?: /* FieldMask */ FieldMask;
        }
        /**
         * UpdateUserResponse
         */
        export interface UpdateUserResponse {
            /**
             * Updated user
             */
            user?: /**
             * User
             *  Users and rights
             * /////////////////
             *  Users are used to dynamically manage the rights given to Daml applications.
             *  They are stored and managed per participant node.
             */
            User;
        }
        /**
         * UploadDarFileResponse
         * A message that is received when the upload operation succeeded.
         */
        export interface UploadDarFileResponse {
        }
        /**
         * User
         *  Users and rights
         * /////////////////
         *  Users are used to dynamically manage the rights given to Daml applications.
         *  They are stored and managed per participant node.
         */
        export interface User {
            /**
             * The user identifier, which must be a non-empty string of at most 128
             * characters that are either alphanumeric ASCII characters or one of the symbols "@^$.!`-#+'~_|:".
             * Required
             */
            id: string;
            /**
             * The primary party as which this user reads and acts by default on the ledger
             * *provided* it has the corresponding ``CanReadAs(primary_party)`` or
             * ``CanActAs(primary_party)`` rights.
             * Ledger API clients SHOULD set this field to a non-empty value for all users to
             * enable the users to act on the ledger using their own Daml party.
             * Users for participant administrators MAY have an associated primary party.
             * Optional,
             * Modifiable
             */
            primaryParty: string;
            /**
             * When set, then the user is denied all access to the Ledger API.
             * Otherwise, the user has access to the Ledger API as per the user's rights.
             * Optional,
             * Modifiable
             */
            isDeactivated: boolean;
            /**
             * The metadata of this user.
             * Note that the ``metadata.resource_version`` tracks changes to the properties described by the ``User`` message and not the user's rights.
             * Optional,
             * Modifiable
             */
            metadata?: /**
             * ObjectMeta
             * Represents metadata corresponding to a participant resource (e.g. a participant user or participant local information about a party).
             *
             * Based on ``ObjectMeta`` meta used in Kubernetes API.
             * See https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/generated.proto#L640
             */
            ObjectMeta;
            /**
             * The ID of the identity provider configured by ``Identity Provider Config``
             * Optional, if not set, assume the user is managed by the default identity provider.
             */
            identityProviderId: string;
        }
        /**
         * UserManagementFeature
         */
        export interface UserManagementFeature {
            /**
             * Whether the Ledger API server provides the user management service.
             */
            supported: boolean;
            /**
             * The maximum number of rights that can be assigned to a single user.
             * Servers MUST support at least 100 rights per user.
             * A value of 0 means that the server enforces no rights per user limit.
             */
            maxRightsPerUser: number; // int32
            /**
             * The maximum number of users the server can return in a single response (page).
             * Servers MUST support at least a 100 users per page.
             * A value of 0 means that the server enforces no page size limit.
             */
            maxUsersPageSize: number; // int32
        }
        /**
         * WildcardFilter
         * This filter matches all templates.
         */
        export interface WildcardFilter {
            value: /**
             * WildcardFilter
             * This filter matches all templates.
             */
            WildcardFilter1;
        }
        /**
         * WildcardFilter
         * This filter matches all templates.
         */
        export interface WildcardFilter1 {
            /**
             * Whether to include a ``created_event_blob`` in the returned ``CreatedEvent``.
             * Use this to access the contract create event payload in your API client
             * for submitting it as a disclosed contract with future commands.
             * Optional
             */
            includeCreatedEventBlob: boolean;
        }
    }
}
declare namespace Paths {
    namespace DeleteV2IdpsIdpId {
        namespace Parameters {
            export type IdpId = string;
        }
        export interface PathParameters {
            "idp-id": Parameters.IdpId;
        }
        namespace Responses {
            export type $200 = /**
             * DeleteIdentityProviderConfigResponse
             * Does not (yet) contain any data.
             */
            Components.Schemas.DeleteIdentityProviderConfigResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace DeleteV2UsersUserId {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            "user-id": Parameters.UserId;
        }
        namespace Responses {
            export interface $200 {
            }
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2AuthenticatedUser {
        namespace Parameters {
            export type IdentityProviderId = string;
        }
        export interface QueryParameters {
            "identity-provider-id"?: Parameters.IdentityProviderId;
        }
        namespace Responses {
            export type $200 = /* GetUserResponse */ Components.Schemas.GetUserResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2Idps {
        namespace Responses {
            export type $200 = /* ListIdentityProviderConfigsResponse */ Components.Schemas.ListIdentityProviderConfigsResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2IdpsIdpId {
        namespace Parameters {
            export type IdpId = string;
        }
        export interface PathParameters {
            "idp-id": Parameters.IdpId;
        }
        namespace Responses {
            export type $200 = /* GetIdentityProviderConfigResponse */ Components.Schemas.GetIdentityProviderConfigResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2InteractiveSubmissionPreferredPackageVersion {
        namespace Parameters {
            export type PackageName = string;
            export type Parties = string[];
            export type SynchronizerId = string;
            export type VettingValidAt = string; // date-time
        }
        export interface QueryParameters {
            parties?: Parameters.Parties;
            "package-name": Parameters.PackageName;
            vetting_valid_at?: Parameters.VettingValidAt /* date-time */;
            "synchronizer-id"?: Parameters.SynchronizerId;
        }
        namespace Responses {
            export type $200 = /* GetPreferredPackageVersionResponse */ Components.Schemas.GetPreferredPackageVersionResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2Packages {
        namespace Responses {
            export type $200 = /* ListPackagesResponse */ Components.Schemas.ListPackagesResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2PackagesPackageId {
        namespace Parameters {
            export type PackageId = string;
        }
        export interface PathParameters {
            "package-id": Parameters.PackageId;
        }
        namespace Responses {
            export type $200 = string; // binary
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2PackagesPackageIdStatus {
        namespace Parameters {
            export type PackageId = string;
        }
        export interface PathParameters {
            "package-id": Parameters.PackageId;
        }
        namespace Responses {
            export type $200 = /* GetPackageStatusResponse */ Components.Schemas.GetPackageStatusResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2Parties {
        namespace Parameters {
            export type PageSize = number; // int32
            export type PageToken = string;
        }
        export interface QueryParameters {
            pageSize?: Parameters.PageSize /* int32 */;
            pageToken?: Parameters.PageToken;
        }
        namespace Responses {
            export type $200 = /* ListKnownPartiesResponse */ Components.Schemas.ListKnownPartiesResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2PartiesParticipantId {
        namespace Responses {
            export type $200 = /* GetParticipantIdResponse */ Components.Schemas.GetParticipantIdResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2PartiesParty {
        namespace Parameters {
            export type IdentityProviderId = string;
            export type Parties = string[];
            export type Party = string;
        }
        export interface PathParameters {
            party: Parameters.Party;
        }
        export interface QueryParameters {
            "identity-provider-id"?: Parameters.IdentityProviderId;
            parties?: Parameters.Parties;
        }
        namespace Responses {
            export type $200 = /* GetPartiesResponse */ Components.Schemas.GetPartiesResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2StateConnectedSynchronizers {
        namespace Parameters {
            export type IdentityProviderId = string;
            export type ParticipantId = string;
            export type Party = string;
        }
        export interface QueryParameters {
            party: Parameters.Party;
            participantId?: Parameters.ParticipantId;
            identityProviderId?: Parameters.IdentityProviderId;
        }
        namespace Responses {
            export type $200 = /* GetConnectedSynchronizersResponse */ Components.Schemas.GetConnectedSynchronizersResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2StateLatestPrunedOffsets {
        namespace Responses {
            export type $200 = /* GetLatestPrunedOffsetsResponse */ Components.Schemas.GetLatestPrunedOffsetsResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2StateLedgerEnd {
        namespace Responses {
            export type $200 = /* GetLedgerEndResponse */ Components.Schemas.GetLedgerEndResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2UpdatesTransactionTreeByIdUpdateId {
        namespace Parameters {
            export type Parties = string[];
            export type UpdateId = string;
        }
        export interface PathParameters {
            "update-id": Parameters.UpdateId;
        }
        export interface QueryParameters {
            parties?: Parameters.Parties;
        }
        namespace Responses {
            export type $200 = /**
             * JsGetTransactionTreeResponse
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             */
            Components.Schemas.JsGetTransactionTreeResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2UpdatesTransactionTreeByOffsetOffset {
        namespace Parameters {
            export type Offset = number; // int64
            export type Parties = string[];
        }
        export interface PathParameters {
            offset: Parameters.Offset /* int64 */;
        }
        export interface QueryParameters {
            parties?: Parameters.Parties;
        }
        namespace Responses {
            export type $200 = /**
             * JsGetTransactionTreeResponse
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             */
            Components.Schemas.JsGetTransactionTreeResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2Users {
        namespace Parameters {
            export type PageSize = number; // int32
            export type PageToken = string;
        }
        export interface QueryParameters {
            pageSize?: Parameters.PageSize /* int32 */;
            pageToken?: Parameters.PageToken;
        }
        namespace Responses {
            export type $200 = /* ListUsersResponse */ Components.Schemas.ListUsersResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2UsersUserId {
        namespace Parameters {
            export type IdentityProviderId = string;
            export type UserId = string;
        }
        export interface PathParameters {
            "user-id": Parameters.UserId;
        }
        export interface QueryParameters {
            "identity-provider-id"?: Parameters.IdentityProviderId;
        }
        namespace Responses {
            export type $200 = /* GetUserResponse */ Components.Schemas.GetUserResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2UsersUserIdRights {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            "user-id": Parameters.UserId;
        }
        namespace Responses {
            export type $200 = /* ListUserRightsResponse */ Components.Schemas.ListUserRightsResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace GetV2Version {
        namespace Responses {
            export type $200 = /* GetLedgerApiVersionResponse */ Components.Schemas.GetLedgerApiVersionResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PatchV2IdpsIdpId {
        namespace Parameters {
            export type IdpId = string;
        }
        export interface PathParameters {
            "idp-id": Parameters.IdpId;
        }
        export type RequestBody = /* UpdateIdentityProviderConfigRequest */ Components.Schemas.UpdateIdentityProviderConfigRequest;
        namespace Responses {
            export type $200 = /* UpdateIdentityProviderConfigResponse */ Components.Schemas.UpdateIdentityProviderConfigResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PatchV2PartiesParty {
        namespace Parameters {
            export type Party = string;
        }
        export interface PathParameters {
            party: Parameters.Party;
        }
        export type RequestBody = /**
         * UpdatePartyDetailsRequest
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(party_details.identity_provider_id)``
         */
        Components.Schemas.UpdatePartyDetailsRequest;
        namespace Responses {
            export type $200 = /* UpdatePartyDetailsResponse */ Components.Schemas.UpdatePartyDetailsResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PatchV2UsersUserId {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            "user-id": Parameters.UserId;
        }
        export type RequestBody = /**
         * UpdateUserRequest
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(user.identity_provider_id)``
         */
        Components.Schemas.UpdateUserRequest;
        namespace Responses {
            export type $200 = /* UpdateUserResponse */ Components.Schemas.UpdateUserResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PatchV2UsersUserIdIdentityProviderId {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            "user-id": Parameters.UserId;
        }
        export type RequestBody = /**
         * UpdateUserIdentityProviderIdRequest
         * Required authorization: ``HasRight(ParticipantAdmin)``
         */
        Components.Schemas.UpdateUserIdentityProviderIdRequest;
        namespace Responses {
            export type $200 = /* UpdateUserIdentityProviderIdResponse */ Components.Schemas.UpdateUserIdentityProviderIdResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PatchV2UsersUserIdRights {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            "user-id": Parameters.UserId;
        }
        export type RequestBody = /**
         * RevokeUserRightsRequest
         * Remove the rights from the set of rights granted to the user.
         *
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(identity_provider_id)``
         */
        Components.Schemas.RevokeUserRightsRequest;
        namespace Responses {
            export type $200 = /* RevokeUserRightsResponse */ Components.Schemas.RevokeUserRightsResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2CommandsAsyncSubmit {
        export type RequestBody = /**
         * JsCommands
         * A composite command that groups multiple commands together.
         */
        Components.Schemas.JsCommands;
        namespace Responses {
            export type $200 = /* SubmitResponse */ Components.Schemas.SubmitResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2CommandsAsyncSubmitReassignment {
        export type RequestBody = /* SubmitReassignmentRequest */ Components.Schemas.SubmitReassignmentRequest;
        namespace Responses {
            export type $200 = /* SubmitReassignmentResponse */ Components.Schemas.SubmitReassignmentResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2CommandsCompletions {
        namespace Parameters {
            export type Limit = number; // int64
            export type StreamIdleTimeoutMs = number; // int64
        }
        export interface QueryParameters {
            limit?: Parameters.Limit /* int64 */;
            stream_idle_timeout_ms?: Parameters.StreamIdleTimeoutMs /* int64 */;
        }
        export type RequestBody = /* CompletionStreamRequest */ Components.Schemas.CompletionStreamRequest;
        namespace Responses {
            export type $200 = /* CompletionStreamResponse */ Components.Schemas.CompletionStreamResponse[];
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2CommandsSubmitAndWait {
        export type RequestBody = /**
         * JsCommands
         * A composite command that groups multiple commands together.
         */
        Components.Schemas.JsCommands;
        namespace Responses {
            export type $200 = /* SubmitAndWaitResponse */ Components.Schemas.SubmitAndWaitResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2CommandsSubmitAndWaitForReassignment {
        export type RequestBody = /**
         * SubmitAndWaitForReassignmentRequest
         * This reassignment is executed as a single atomic update.
         */
        Components.Schemas.SubmitAndWaitForReassignmentRequest;
        namespace Responses {
            export type $200 = /* JsSubmitAndWaitForReassignmentResponse */ Components.Schemas.JsSubmitAndWaitForReassignmentResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2CommandsSubmitAndWaitForTransaction {
        export type RequestBody = /**
         * JsSubmitAndWaitForTransactionRequest
         * These commands are executed as a single atomic transaction.
         */
        Components.Schemas.JsSubmitAndWaitForTransactionRequest;
        namespace Responses {
            export type $200 = /* JsSubmitAndWaitForTransactionResponse */ Components.Schemas.JsSubmitAndWaitForTransactionResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2CommandsSubmitAndWaitForTransactionTree {
        export type RequestBody = /**
         * JsCommands
         * A composite command that groups multiple commands together.
         */
        Components.Schemas.JsCommands;
        namespace Responses {
            export type $200 = /**
             * JsSubmitAndWaitForTransactionTreeResponse
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             */
            Components.Schemas.JsSubmitAndWaitForTransactionTreeResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2EventsEventsByContractId {
        export type RequestBody = /* GetEventsByContractIdRequest */ Components.Schemas.GetEventsByContractIdRequest;
        namespace Responses {
            export type $200 = /* JsGetEventsByContractIdResponse */ Components.Schemas.JsGetEventsByContractIdResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2Idps {
        export type RequestBody = /* CreateIdentityProviderConfigRequest */ Components.Schemas.CreateIdentityProviderConfigRequest;
        namespace Responses {
            export type $200 = /* CreateIdentityProviderConfigResponse */ Components.Schemas.CreateIdentityProviderConfigResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2InteractiveSubmissionExecute {
        export type RequestBody = /* JsExecuteSubmissionRequest */ Components.Schemas.JsExecuteSubmissionRequest;
        namespace Responses {
            export type $200 = /* ExecuteSubmissionResponse */ Components.Schemas.ExecuteSubmissionResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2InteractiveSubmissionPreferredPackages {
        export type RequestBody = /* GetPreferredPackagesRequest */ Components.Schemas.GetPreferredPackagesRequest;
        namespace Responses {
            export type $200 = /* GetPreferredPackagesResponse */ Components.Schemas.GetPreferredPackagesResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2InteractiveSubmissionPrepare {
        export type RequestBody = /* JsPrepareSubmissionRequest */ Components.Schemas.JsPrepareSubmissionRequest;
        namespace Responses {
            export type $200 = /**
             * JsPrepareSubmissionResponse
             * [docs-entry-end: HashingSchemeVersion]
             */
            Components.Schemas.JsPrepareSubmissionResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2Packages {
        export type RequestBody = string; // binary
        namespace Responses {
            export type $200 = /**
             * UploadDarFileResponse
             * A message that is received when the upload operation succeeded.
             */
            Components.Schemas.UploadDarFileResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2Parties {
        export type RequestBody = /**
         * AllocatePartyRequest
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(identity_provider_id)``
         */
        Components.Schemas.AllocatePartyRequest;
        namespace Responses {
            export type $200 = /* AllocatePartyResponse */ Components.Schemas.AllocatePartyResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2StateActiveContracts {
        namespace Parameters {
            export type Limit = number; // int64
            export type StreamIdleTimeoutMs = number; // int64
        }
        export interface QueryParameters {
            limit?: Parameters.Limit /* int64 */;
            stream_idle_timeout_ms?: Parameters.StreamIdleTimeoutMs /* int64 */;
        }
        export type RequestBody = /**
         * GetActiveContractsRequest
         * If the given offset is different than the ledger end, and there are (un)assignments in-flight at the given offset,
         * the snapshot may fail with "FAILED_PRECONDITION/PARTICIPANT_PRUNED_DATA_ACCESSED".
         * Note that it is ok to request acs snapshots for party migration with offsets other than ledger end, because party
         * migration is not concerned with incomplete (un)assignments.
         */
        Components.Schemas.GetActiveContractsRequest;
        namespace Responses {
            export type $200 = /* JsGetActiveContractsResponse */ Components.Schemas.JsGetActiveContractsResponse[];
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2UpdatesFlats {
        namespace Parameters {
            export type Limit = number; // int64
            export type StreamIdleTimeoutMs = number; // int64
        }
        export interface QueryParameters {
            limit?: Parameters.Limit /* int64 */;
            stream_idle_timeout_ms?: Parameters.StreamIdleTimeoutMs /* int64 */;
        }
        export type RequestBody = /* GetUpdatesRequest */ Components.Schemas.GetUpdatesRequest;
        namespace Responses {
            export type $200 = /* JsGetUpdatesResponse */ Components.Schemas.JsGetUpdatesResponse[];
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2UpdatesTransactionById {
        export type RequestBody = /**
         * GetTransactionByIdRequest
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         */
        Components.Schemas.GetTransactionByIdRequest;
        namespace Responses {
            export type $200 = /**
             * JsGetTransactionResponse
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             */
            Components.Schemas.JsGetTransactionResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2UpdatesTransactionByOffset {
        export type RequestBody = /**
         * GetTransactionByOffsetRequest
         * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
         */
        Components.Schemas.GetTransactionByOffsetRequest;
        namespace Responses {
            export type $200 = /**
             * JsGetTransactionResponse
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             */
            Components.Schemas.JsGetTransactionResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2UpdatesTrees {
        namespace Parameters {
            export type Limit = number; // int64
            export type StreamIdleTimeoutMs = number; // int64
        }
        export interface QueryParameters {
            limit?: Parameters.Limit /* int64 */;
            stream_idle_timeout_ms?: Parameters.StreamIdleTimeoutMs /* int64 */;
        }
        export type RequestBody = /* GetUpdatesRequest */ Components.Schemas.GetUpdatesRequest;
        namespace Responses {
            export type $200 = /**
             * JsGetUpdateTreesResponse
             * Provided for backwards compatibility, it will be removed in the Canton version 3.4.0.
             */
            Components.Schemas.JsGetUpdateTreesResponse[];
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2UpdatesUpdateById {
        export type RequestBody = /* GetUpdateByIdRequest */ Components.Schemas.GetUpdateByIdRequest;
        namespace Responses {
            export type $200 = /* JsGetUpdateResponse */ Components.Schemas.JsGetUpdateResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2UpdatesUpdateByOffset {
        export type RequestBody = /* GetUpdateByOffsetRequest */ Components.Schemas.GetUpdateByOffsetRequest;
        namespace Responses {
            export type $200 = /* JsGetUpdateResponse */ Components.Schemas.JsGetUpdateResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2Users {
        export type RequestBody = /**
         * CreateUserRequest
         *  RPC requests and responses
         * ///////////////////////////
         *  Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(user.identity_provider_id)``
         */
        Components.Schemas.CreateUserRequest;
        namespace Responses {
            export type $200 = /* CreateUserResponse */ Components.Schemas.CreateUserResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
    namespace PostV2UsersUserIdRights {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            "user-id": Parameters.UserId;
        }
        export type RequestBody = /**
         * GrantUserRightsRequest
         * Add the rights to the set of rights granted to the user.
         *
         * Required authorization: ``HasRight(ParticipantAdmin) OR IsAuthenticatedIdentityProviderAdmin(identity_provider_id)``
         */
        Components.Schemas.GrantUserRightsRequest;
        namespace Responses {
            export type $200 = /* GrantUserRightsResponse */ Components.Schemas.GrantUserRightsResponse;
            export type $400 = string;
            export type Default = /* JsCantonError */ Components.Schemas.JsCantonError;
        }
    }
}


export interface OperationMethods {
  /**
   * postV2CommandsSubmit-and-wait - Submit a batch of commands and wait for the completion details
   */
  'postV2CommandsSubmit-and-wait'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2CommandsSubmitAndWait.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2CommandsSubmitAndWait.Responses.$200 | Paths.PostV2CommandsSubmitAndWait.Responses.Default>
  /**
   * postV2CommandsSubmit-and-wait-for-transaction - Submit a batch of commands and wait for the transaction response
   */
  'postV2CommandsSubmit-and-wait-for-transaction'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2CommandsSubmitAndWaitForTransaction.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2CommandsSubmitAndWaitForTransaction.Responses.$200 | Paths.PostV2CommandsSubmitAndWaitForTransaction.Responses.Default>
  /**
   * postV2CommandsSubmit-and-wait-for-reassignment - Submit a batch of reassignment commands and wait for the reassignment response
   */
  'postV2CommandsSubmit-and-wait-for-reassignment'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2CommandsSubmitAndWaitForReassignment.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2CommandsSubmitAndWaitForReassignment.Responses.$200 | Paths.PostV2CommandsSubmitAndWaitForReassignment.Responses.Default>
  /**
   * postV2CommandsSubmit-and-wait-for-transaction-tree - Submit a batch of commands and wait for the transaction trees response
   */
  'postV2CommandsSubmit-and-wait-for-transaction-tree'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2CommandsSubmitAndWaitForTransactionTree.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2CommandsSubmitAndWaitForTransactionTree.Responses.$200 | Paths.PostV2CommandsSubmitAndWaitForTransactionTree.Responses.Default>
  /**
   * postV2CommandsAsyncSubmit - Submit a command asynchronously
   */
  'postV2CommandsAsyncSubmit'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2CommandsAsyncSubmit.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2CommandsAsyncSubmit.Responses.$200 | Paths.PostV2CommandsAsyncSubmit.Responses.Default>
  /**
   * postV2CommandsAsyncSubmit-reassignment - Submit reassignment command asynchronously
   */
  'postV2CommandsAsyncSubmit-reassignment'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2CommandsAsyncSubmitReassignment.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2CommandsAsyncSubmitReassignment.Responses.$200 | Paths.PostV2CommandsAsyncSubmitReassignment.Responses.Default>
  /**
   * postV2CommandsCompletions - Query completions list (blocking call)
   */
  'postV2CommandsCompletions'(
    parameters?: Parameters<Paths.PostV2CommandsCompletions.QueryParameters> | null,
    data?: Paths.PostV2CommandsCompletions.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2CommandsCompletions.Responses.$200 | Paths.PostV2CommandsCompletions.Responses.Default>
  /**
   * postV2EventsEvents-by-contract-id - Get events by contract Id
   */
  'postV2EventsEvents-by-contract-id'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2EventsEventsByContractId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2EventsEventsByContractId.Responses.$200 | Paths.PostV2EventsEventsByContractId.Responses.Default>
  /**
   * getV2Version - Get the version details of the participant node
   */
  'getV2Version'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2Version.Responses.$200 | Paths.GetV2Version.Responses.Default>
  /**
   * getV2Packages - List all packages uploaded on the participant node
   */
  'getV2Packages'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2Packages.Responses.$200 | Paths.GetV2Packages.Responses.Default>
  /**
   * postV2Packages - Upload a DAR to the participant node
   */
  'postV2Packages'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2Packages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2Packages.Responses.$200 | Paths.PostV2Packages.Responses.Default>
  /**
   * getV2PackagesPackage-id - Download the package for the requested package-id
   */
  'getV2PackagesPackage-id'(
    parameters?: Parameters<Paths.GetV2PackagesPackageId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2PackagesPackageId.Responses.$200 | Paths.GetV2PackagesPackageId.Responses.Default>
  /**
   * getV2PackagesPackage-idStatus - Get package status
   */
  'getV2PackagesPackage-idStatus'(
    parameters?: Parameters<Paths.GetV2PackagesPackageIdStatus.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2PackagesPackageIdStatus.Responses.$200 | Paths.GetV2PackagesPackageIdStatus.Responses.Default>
  /**
   * getV2Parties - List all known parties.
   */
  'getV2Parties'(
    parameters?: Parameters<Paths.GetV2Parties.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2Parties.Responses.$200 | Paths.GetV2Parties.Responses.Default>
  /**
   * postV2Parties - Allocate a new party to the participant node
   */
  'postV2Parties'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2Parties.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2Parties.Responses.$200 | Paths.PostV2Parties.Responses.Default>
  /**
   * getV2PartiesParticipant-id - Get participant id
   */
  'getV2PartiesParticipant-id'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2PartiesParticipantId.Responses.$200 | Paths.GetV2PartiesParticipantId.Responses.Default>
  /**
   * getV2PartiesParty - Get party details
   */
  'getV2PartiesParty'(
    parameters?: Parameters<Paths.GetV2PartiesParty.QueryParameters & Paths.GetV2PartiesParty.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2PartiesParty.Responses.$200 | Paths.GetV2PartiesParty.Responses.Default>
  /**
   * patchV2PartiesParty - Allocate a new party to the participant node
   */
  'patchV2PartiesParty'(
    parameters?: Parameters<Paths.PatchV2PartiesParty.PathParameters> | null,
    data?: Paths.PatchV2PartiesParty.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchV2PartiesParty.Responses.$200 | Paths.PatchV2PartiesParty.Responses.Default>
  /**
   * postV2StateActive-contracts - Query active contracts list (blocking call)
   */
  'postV2StateActive-contracts'(
    parameters?: Parameters<Paths.PostV2StateActiveContracts.QueryParameters> | null,
    data?: Paths.PostV2StateActiveContracts.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2StateActiveContracts.Responses.$200 | Paths.PostV2StateActiveContracts.Responses.Default>
  /**
   * getV2StateConnected-synchronizers - Get connected synchronizers
   */
  'getV2StateConnected-synchronizers'(
    parameters?: Parameters<Paths.GetV2StateConnectedSynchronizers.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2StateConnectedSynchronizers.Responses.$200 | Paths.GetV2StateConnectedSynchronizers.Responses.Default>
  /**
   * getV2StateLedger-end - Get ledger end
   */
  'getV2StateLedger-end'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2StateLedgerEnd.Responses.$200 | Paths.GetV2StateLedgerEnd.Responses.Default>
  /**
   * getV2StateLatest-pruned-offsets - Get latest pruned offsets
   */
  'getV2StateLatest-pruned-offsets'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2StateLatestPrunedOffsets.Responses.$200 | Paths.GetV2StateLatestPrunedOffsets.Responses.Default>
  /**
   * postV2UpdatesFlats - Query flat transactions update list (blocking call)
   */
  'postV2UpdatesFlats'(
    parameters?: Parameters<Paths.PostV2UpdatesFlats.QueryParameters> | null,
    data?: Paths.PostV2UpdatesFlats.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2UpdatesFlats.Responses.$200 | Paths.PostV2UpdatesFlats.Responses.Default>
  /**
   * postV2UpdatesTrees - Query update transactions tree list (blocking call)
   */
  'postV2UpdatesTrees'(
    parameters?: Parameters<Paths.PostV2UpdatesTrees.QueryParameters> | null,
    data?: Paths.PostV2UpdatesTrees.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2UpdatesTrees.Responses.$200 | Paths.PostV2UpdatesTrees.Responses.Default>
  /**
   * getV2UpdatesTransaction-tree-by-offsetOffset - Get transaction tree by offset
   */
  'getV2UpdatesTransaction-tree-by-offsetOffset'(
    parameters?: Parameters<Paths.GetV2UpdatesTransactionTreeByOffsetOffset.QueryParameters & Paths.GetV2UpdatesTransactionTreeByOffsetOffset.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2UpdatesTransactionTreeByOffsetOffset.Responses.$200 | Paths.GetV2UpdatesTransactionTreeByOffsetOffset.Responses.Default>
  /**
   * postV2UpdatesTransaction-by-offset - Get transaction by offset
   */
  'postV2UpdatesTransaction-by-offset'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2UpdatesTransactionByOffset.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2UpdatesTransactionByOffset.Responses.$200 | Paths.PostV2UpdatesTransactionByOffset.Responses.Default>
  /**
   * postV2UpdatesUpdate-by-offset - Get update by offset
   */
  'postV2UpdatesUpdate-by-offset'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2UpdatesUpdateByOffset.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2UpdatesUpdateByOffset.Responses.$200 | Paths.PostV2UpdatesUpdateByOffset.Responses.Default>
  /**
   * postV2UpdatesTransaction-by-id - Get transaction by id
   */
  'postV2UpdatesTransaction-by-id'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2UpdatesTransactionById.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2UpdatesTransactionById.Responses.$200 | Paths.PostV2UpdatesTransactionById.Responses.Default>
  /**
   * postV2UpdatesUpdate-by-id - Get update by id
   */
  'postV2UpdatesUpdate-by-id'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2UpdatesUpdateById.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2UpdatesUpdateById.Responses.$200 | Paths.PostV2UpdatesUpdateById.Responses.Default>
  /**
   * getV2UpdatesTransaction-tree-by-idUpdate-id - Get transaction tree by  id
   */
  'getV2UpdatesTransaction-tree-by-idUpdate-id'(
    parameters?: Parameters<Paths.GetV2UpdatesTransactionTreeByIdUpdateId.QueryParameters & Paths.GetV2UpdatesTransactionTreeByIdUpdateId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2UpdatesTransactionTreeByIdUpdateId.Responses.$200 | Paths.GetV2UpdatesTransactionTreeByIdUpdateId.Responses.Default>
  /**
   * getV2Users - List all users.
   */
  'getV2Users'(
    parameters?: Parameters<Paths.GetV2Users.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2Users.Responses.$200 | Paths.GetV2Users.Responses.Default>
  /**
   * postV2Users - Create user.
   */
  'postV2Users'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2Users.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2Users.Responses.$200 | Paths.PostV2Users.Responses.Default>
  /**
   * getV2UsersUser-id - Get user details.
   */
  'getV2UsersUser-id'(
    parameters?: Parameters<Paths.GetV2UsersUserId.QueryParameters & Paths.GetV2UsersUserId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2UsersUserId.Responses.$200 | Paths.GetV2UsersUserId.Responses.Default>
  /**
   * patchV2UsersUser-id - Update  user.
   */
  'patchV2UsersUser-id'(
    parameters?: Parameters<Paths.PatchV2UsersUserId.PathParameters> | null,
    data?: Paths.PatchV2UsersUserId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchV2UsersUserId.Responses.$200 | Paths.PatchV2UsersUserId.Responses.Default>
  /**
   * deleteV2UsersUser-id - Delete user.
   */
  'deleteV2UsersUser-id'(
    parameters?: Parameters<Paths.DeleteV2UsersUserId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteV2UsersUserId.Responses.$200 | Paths.DeleteV2UsersUserId.Responses.Default>
  /**
   * getV2Authenticated-user - Get current user details (uses user for JWT).
   */
  'getV2Authenticated-user'(
    parameters?: Parameters<Paths.GetV2AuthenticatedUser.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2AuthenticatedUser.Responses.$200 | Paths.GetV2AuthenticatedUser.Responses.Default>
  /**
   * getV2UsersUser-idRights - List user rights.
   */
  'getV2UsersUser-idRights'(
    parameters?: Parameters<Paths.GetV2UsersUserIdRights.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2UsersUserIdRights.Responses.$200 | Paths.GetV2UsersUserIdRights.Responses.Default>
  /**
   * postV2UsersUser-idRights - Grant user rights.
   */
  'postV2UsersUser-idRights'(
    parameters?: Parameters<Paths.PostV2UsersUserIdRights.PathParameters> | null,
    data?: Paths.PostV2UsersUserIdRights.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2UsersUserIdRights.Responses.$200 | Paths.PostV2UsersUserIdRights.Responses.Default>
  /**
   * patchV2UsersUser-idRights - Revoke user rights.
   */
  'patchV2UsersUser-idRights'(
    parameters?: Parameters<Paths.PatchV2UsersUserIdRights.PathParameters> | null,
    data?: Paths.PatchV2UsersUserIdRights.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchV2UsersUserIdRights.Responses.$200 | Paths.PatchV2UsersUserIdRights.Responses.Default>
  /**
   * patchV2UsersUser-idIdentity-provider-id - Update user identity provider.
   */
  'patchV2UsersUser-idIdentity-provider-id'(
    parameters?: Parameters<Paths.PatchV2UsersUserIdIdentityProviderId.PathParameters> | null,
    data?: Paths.PatchV2UsersUserIdIdentityProviderId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchV2UsersUserIdIdentityProviderId.Responses.$200 | Paths.PatchV2UsersUserIdIdentityProviderId.Responses.Default>
  /**
   * getV2Idps - List all identity provider configs
   */
  'getV2Idps'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2Idps.Responses.$200 | Paths.GetV2Idps.Responses.Default>
  /**
   * postV2Idps - Create identity provider configs
   */
  'postV2Idps'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2Idps.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2Idps.Responses.$200 | Paths.PostV2Idps.Responses.Default>
  /**
   * getV2IdpsIdp-id - Get identity provider config
   */
  'getV2IdpsIdp-id'(
    parameters?: Parameters<Paths.GetV2IdpsIdpId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2IdpsIdpId.Responses.$200 | Paths.GetV2IdpsIdpId.Responses.Default>
  /**
   * patchV2IdpsIdp-id - Update identity provider config
   */
  'patchV2IdpsIdp-id'(
    parameters?: Parameters<Paths.PatchV2IdpsIdpId.PathParameters> | null,
    data?: Paths.PatchV2IdpsIdpId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchV2IdpsIdpId.Responses.$200 | Paths.PatchV2IdpsIdpId.Responses.Default>
  /**
   * deleteV2IdpsIdp-id - Delete identity provider config
   */
  'deleteV2IdpsIdp-id'(
    parameters?: Parameters<Paths.DeleteV2IdpsIdpId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteV2IdpsIdpId.Responses.$200 | Paths.DeleteV2IdpsIdpId.Responses.Default>
  /**
   * postV2Interactive-submissionPrepare - Prepare commands for signing
   */
  'postV2Interactive-submissionPrepare'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2InteractiveSubmissionPrepare.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2InteractiveSubmissionPrepare.Responses.$200 | Paths.PostV2InteractiveSubmissionPrepare.Responses.Default>
  /**
   * postV2Interactive-submissionExecute - Execute a signed transaction
   */
  'postV2Interactive-submissionExecute'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2InteractiveSubmissionExecute.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2InteractiveSubmissionExecute.Responses.$200 | Paths.PostV2InteractiveSubmissionExecute.Responses.Default>
  /**
   * getV2Interactive-submissionPreferred-package-version - Get the preferred package version for constructing a command submission
   */
  'getV2Interactive-submissionPreferred-package-version'(
    parameters?: Parameters<Paths.GetV2InteractiveSubmissionPreferredPackageVersion.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetV2InteractiveSubmissionPreferredPackageVersion.Responses.$200 | Paths.GetV2InteractiveSubmissionPreferredPackageVersion.Responses.Default>
  /**
   * postV2Interactive-submissionPreferred-packages - Get the version of preferred packages for constructing a command submission
   */
  'postV2Interactive-submissionPreferred-packages'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostV2InteractiveSubmissionPreferredPackages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostV2InteractiveSubmissionPreferredPackages.Responses.$200 | Paths.PostV2InteractiveSubmissionPreferredPackages.Responses.Default>
}

export interface PathsDictionary {
  ['/v2/commands/submit-and-wait']: {
    /**
     * postV2CommandsSubmit-and-wait - Submit a batch of commands and wait for the completion details
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2CommandsSubmitAndWait.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2CommandsSubmitAndWait.Responses.$200 | Paths.PostV2CommandsSubmitAndWait.Responses.Default>
  }
  ['/v2/commands/submit-and-wait-for-transaction']: {
    /**
     * postV2CommandsSubmit-and-wait-for-transaction - Submit a batch of commands and wait for the transaction response
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2CommandsSubmitAndWaitForTransaction.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2CommandsSubmitAndWaitForTransaction.Responses.$200 | Paths.PostV2CommandsSubmitAndWaitForTransaction.Responses.Default>
  }
  ['/v2/commands/submit-and-wait-for-reassignment']: {
    /**
     * postV2CommandsSubmit-and-wait-for-reassignment - Submit a batch of reassignment commands and wait for the reassignment response
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2CommandsSubmitAndWaitForReassignment.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2CommandsSubmitAndWaitForReassignment.Responses.$200 | Paths.PostV2CommandsSubmitAndWaitForReassignment.Responses.Default>
  }
  ['/v2/commands/submit-and-wait-for-transaction-tree']: {
    /**
     * postV2CommandsSubmit-and-wait-for-transaction-tree - Submit a batch of commands and wait for the transaction trees response
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2CommandsSubmitAndWaitForTransactionTree.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2CommandsSubmitAndWaitForTransactionTree.Responses.$200 | Paths.PostV2CommandsSubmitAndWaitForTransactionTree.Responses.Default>
  }
  ['/v2/commands/async/submit']: {
    /**
     * postV2CommandsAsyncSubmit - Submit a command asynchronously
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2CommandsAsyncSubmit.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2CommandsAsyncSubmit.Responses.$200 | Paths.PostV2CommandsAsyncSubmit.Responses.Default>
  }
  ['/v2/commands/async/submit-reassignment']: {
    /**
     * postV2CommandsAsyncSubmit-reassignment - Submit reassignment command asynchronously
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2CommandsAsyncSubmitReassignment.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2CommandsAsyncSubmitReassignment.Responses.$200 | Paths.PostV2CommandsAsyncSubmitReassignment.Responses.Default>
  }
  ['/v2/commands/completions']: {
    /**
     * postV2CommandsCompletions - Query completions list (blocking call)
     */
    'post'(
      parameters?: Parameters<Paths.PostV2CommandsCompletions.QueryParameters> | null,
      data?: Paths.PostV2CommandsCompletions.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2CommandsCompletions.Responses.$200 | Paths.PostV2CommandsCompletions.Responses.Default>
  }
  ['/v2/events/events-by-contract-id']: {
    /**
     * postV2EventsEvents-by-contract-id - Get events by contract Id
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2EventsEventsByContractId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2EventsEventsByContractId.Responses.$200 | Paths.PostV2EventsEventsByContractId.Responses.Default>
  }
  ['/v2/version']: {
    /**
     * getV2Version - Get the version details of the participant node
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2Version.Responses.$200 | Paths.GetV2Version.Responses.Default>
  }
  ['/v2/packages']: {
    /**
     * getV2Packages - List all packages uploaded on the participant node
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2Packages.Responses.$200 | Paths.GetV2Packages.Responses.Default>
    /**
     * postV2Packages - Upload a DAR to the participant node
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2Packages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2Packages.Responses.$200 | Paths.PostV2Packages.Responses.Default>
  }
  ['/v2/packages/{package-id}']: {
    /**
     * getV2PackagesPackage-id - Download the package for the requested package-id
     */
    'get'(
      parameters?: Parameters<Paths.GetV2PackagesPackageId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2PackagesPackageId.Responses.$200 | Paths.GetV2PackagesPackageId.Responses.Default>
  }
  ['/v2/packages/{package-id}/status']: {
    /**
     * getV2PackagesPackage-idStatus - Get package status
     */
    'get'(
      parameters?: Parameters<Paths.GetV2PackagesPackageIdStatus.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2PackagesPackageIdStatus.Responses.$200 | Paths.GetV2PackagesPackageIdStatus.Responses.Default>
  }
  ['/v2/parties']: {
    /**
     * getV2Parties - List all known parties.
     */
    'get'(
      parameters?: Parameters<Paths.GetV2Parties.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2Parties.Responses.$200 | Paths.GetV2Parties.Responses.Default>
    /**
     * postV2Parties - Allocate a new party to the participant node
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2Parties.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2Parties.Responses.$200 | Paths.PostV2Parties.Responses.Default>
  }
  ['/v2/parties/participant-id']: {
    /**
     * getV2PartiesParticipant-id - Get participant id
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2PartiesParticipantId.Responses.$200 | Paths.GetV2PartiesParticipantId.Responses.Default>
  }
  ['/v2/parties/{party}']: {
    /**
     * getV2PartiesParty - Get party details
     */
    'get'(
      parameters?: Parameters<Paths.GetV2PartiesParty.QueryParameters & Paths.GetV2PartiesParty.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2PartiesParty.Responses.$200 | Paths.GetV2PartiesParty.Responses.Default>
    /**
     * patchV2PartiesParty - Allocate a new party to the participant node
     */
    'patch'(
      parameters?: Parameters<Paths.PatchV2PartiesParty.PathParameters> | null,
      data?: Paths.PatchV2PartiesParty.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchV2PartiesParty.Responses.$200 | Paths.PatchV2PartiesParty.Responses.Default>
  }
  ['/v2/state/active-contracts']: {
    /**
     * postV2StateActive-contracts - Query active contracts list (blocking call)
     */
    'post'(
      parameters?: Parameters<Paths.PostV2StateActiveContracts.QueryParameters> | null,
      data?: Paths.PostV2StateActiveContracts.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2StateActiveContracts.Responses.$200 | Paths.PostV2StateActiveContracts.Responses.Default>
  }
  ['/v2/state/connected-synchronizers']: {
    /**
     * getV2StateConnected-synchronizers - Get connected synchronizers
     */
    'get'(
      parameters?: Parameters<Paths.GetV2StateConnectedSynchronizers.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2StateConnectedSynchronizers.Responses.$200 | Paths.GetV2StateConnectedSynchronizers.Responses.Default>
  }
  ['/v2/state/ledger-end']: {
    /**
     * getV2StateLedger-end - Get ledger end
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2StateLedgerEnd.Responses.$200 | Paths.GetV2StateLedgerEnd.Responses.Default>
  }
  ['/v2/state/latest-pruned-offsets']: {
    /**
     * getV2StateLatest-pruned-offsets - Get latest pruned offsets
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2StateLatestPrunedOffsets.Responses.$200 | Paths.GetV2StateLatestPrunedOffsets.Responses.Default>
  }
  ['/v2/updates/flats']: {
    /**
     * postV2UpdatesFlats - Query flat transactions update list (blocking call)
     */
    'post'(
      parameters?: Parameters<Paths.PostV2UpdatesFlats.QueryParameters> | null,
      data?: Paths.PostV2UpdatesFlats.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2UpdatesFlats.Responses.$200 | Paths.PostV2UpdatesFlats.Responses.Default>
  }
  ['/v2/updates/trees']: {
    /**
     * postV2UpdatesTrees - Query update transactions tree list (blocking call)
     */
    'post'(
      parameters?: Parameters<Paths.PostV2UpdatesTrees.QueryParameters> | null,
      data?: Paths.PostV2UpdatesTrees.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2UpdatesTrees.Responses.$200 | Paths.PostV2UpdatesTrees.Responses.Default>
  }
  ['/v2/updates/transaction-tree-by-offset/{offset}']: {
    /**
     * getV2UpdatesTransaction-tree-by-offsetOffset - Get transaction tree by offset
     */
    'get'(
      parameters?: Parameters<Paths.GetV2UpdatesTransactionTreeByOffsetOffset.QueryParameters & Paths.GetV2UpdatesTransactionTreeByOffsetOffset.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2UpdatesTransactionTreeByOffsetOffset.Responses.$200 | Paths.GetV2UpdatesTransactionTreeByOffsetOffset.Responses.Default>
  }
  ['/v2/updates/transaction-by-offset']: {
    /**
     * postV2UpdatesTransaction-by-offset - Get transaction by offset
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2UpdatesTransactionByOffset.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2UpdatesTransactionByOffset.Responses.$200 | Paths.PostV2UpdatesTransactionByOffset.Responses.Default>
  }
  ['/v2/updates/update-by-offset']: {
    /**
     * postV2UpdatesUpdate-by-offset - Get update by offset
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2UpdatesUpdateByOffset.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2UpdatesUpdateByOffset.Responses.$200 | Paths.PostV2UpdatesUpdateByOffset.Responses.Default>
  }
  ['/v2/updates/transaction-by-id']: {
    /**
     * postV2UpdatesTransaction-by-id - Get transaction by id
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2UpdatesTransactionById.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2UpdatesTransactionById.Responses.$200 | Paths.PostV2UpdatesTransactionById.Responses.Default>
  }
  ['/v2/updates/update-by-id']: {
    /**
     * postV2UpdatesUpdate-by-id - Get update by id
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2UpdatesUpdateById.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2UpdatesUpdateById.Responses.$200 | Paths.PostV2UpdatesUpdateById.Responses.Default>
  }
  ['/v2/updates/transaction-tree-by-id/{update-id}']: {
    /**
     * getV2UpdatesTransaction-tree-by-idUpdate-id - Get transaction tree by  id
     */
    'get'(
      parameters?: Parameters<Paths.GetV2UpdatesTransactionTreeByIdUpdateId.QueryParameters & Paths.GetV2UpdatesTransactionTreeByIdUpdateId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2UpdatesTransactionTreeByIdUpdateId.Responses.$200 | Paths.GetV2UpdatesTransactionTreeByIdUpdateId.Responses.Default>
  }
  ['/v2/users']: {
    /**
     * getV2Users - List all users.
     */
    'get'(
      parameters?: Parameters<Paths.GetV2Users.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2Users.Responses.$200 | Paths.GetV2Users.Responses.Default>
    /**
     * postV2Users - Create user.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2Users.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2Users.Responses.$200 | Paths.PostV2Users.Responses.Default>
  }
  ['/v2/users/{user-id}']: {
    /**
     * getV2UsersUser-id - Get user details.
     */
    'get'(
      parameters?: Parameters<Paths.GetV2UsersUserId.QueryParameters & Paths.GetV2UsersUserId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2UsersUserId.Responses.$200 | Paths.GetV2UsersUserId.Responses.Default>
    /**
     * deleteV2UsersUser-id - Delete user.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteV2UsersUserId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteV2UsersUserId.Responses.$200 | Paths.DeleteV2UsersUserId.Responses.Default>
    /**
     * patchV2UsersUser-id - Update  user.
     */
    'patch'(
      parameters?: Parameters<Paths.PatchV2UsersUserId.PathParameters> | null,
      data?: Paths.PatchV2UsersUserId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchV2UsersUserId.Responses.$200 | Paths.PatchV2UsersUserId.Responses.Default>
  }
  ['/v2/authenticated-user']: {
    /**
     * getV2Authenticated-user - Get current user details (uses user for JWT).
     */
    'get'(
      parameters?: Parameters<Paths.GetV2AuthenticatedUser.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2AuthenticatedUser.Responses.$200 | Paths.GetV2AuthenticatedUser.Responses.Default>
  }
  ['/v2/users/{user-id}/rights']: {
    /**
     * getV2UsersUser-idRights - List user rights.
     */
    'get'(
      parameters?: Parameters<Paths.GetV2UsersUserIdRights.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2UsersUserIdRights.Responses.$200 | Paths.GetV2UsersUserIdRights.Responses.Default>
    /**
     * postV2UsersUser-idRights - Grant user rights.
     */
    'post'(
      parameters?: Parameters<Paths.PostV2UsersUserIdRights.PathParameters> | null,
      data?: Paths.PostV2UsersUserIdRights.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2UsersUserIdRights.Responses.$200 | Paths.PostV2UsersUserIdRights.Responses.Default>
    /**
     * patchV2UsersUser-idRights - Revoke user rights.
     */
    'patch'(
      parameters?: Parameters<Paths.PatchV2UsersUserIdRights.PathParameters> | null,
      data?: Paths.PatchV2UsersUserIdRights.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchV2UsersUserIdRights.Responses.$200 | Paths.PatchV2UsersUserIdRights.Responses.Default>
  }
  ['/v2/users/{user-id}/identity-provider-id']: {
    /**
     * patchV2UsersUser-idIdentity-provider-id - Update user identity provider.
     */
    'patch'(
      parameters?: Parameters<Paths.PatchV2UsersUserIdIdentityProviderId.PathParameters> | null,
      data?: Paths.PatchV2UsersUserIdIdentityProviderId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchV2UsersUserIdIdentityProviderId.Responses.$200 | Paths.PatchV2UsersUserIdIdentityProviderId.Responses.Default>
  }
  ['/v2/idps']: {
    /**
     * getV2Idps - List all identity provider configs
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2Idps.Responses.$200 | Paths.GetV2Idps.Responses.Default>
    /**
     * postV2Idps - Create identity provider configs
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2Idps.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2Idps.Responses.$200 | Paths.PostV2Idps.Responses.Default>
  }
  ['/v2/idps/{idp-id}']: {
    /**
     * getV2IdpsIdp-id - Get identity provider config
     */
    'get'(
      parameters?: Parameters<Paths.GetV2IdpsIdpId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2IdpsIdpId.Responses.$200 | Paths.GetV2IdpsIdpId.Responses.Default>
    /**
     * deleteV2IdpsIdp-id - Delete identity provider config
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteV2IdpsIdpId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteV2IdpsIdpId.Responses.$200 | Paths.DeleteV2IdpsIdpId.Responses.Default>
    /**
     * patchV2IdpsIdp-id - Update identity provider config
     */
    'patch'(
      parameters?: Parameters<Paths.PatchV2IdpsIdpId.PathParameters> | null,
      data?: Paths.PatchV2IdpsIdpId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchV2IdpsIdpId.Responses.$200 | Paths.PatchV2IdpsIdpId.Responses.Default>
  }
  ['/v2/interactive-submission/prepare']: {
    /**
     * postV2Interactive-submissionPrepare - Prepare commands for signing
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2InteractiveSubmissionPrepare.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2InteractiveSubmissionPrepare.Responses.$200 | Paths.PostV2InteractiveSubmissionPrepare.Responses.Default>
  }
  ['/v2/interactive-submission/execute']: {
    /**
     * postV2Interactive-submissionExecute - Execute a signed transaction
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2InteractiveSubmissionExecute.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2InteractiveSubmissionExecute.Responses.$200 | Paths.PostV2InteractiveSubmissionExecute.Responses.Default>
  }
  ['/v2/interactive-submission/preferred-package-version']: {
    /**
     * getV2Interactive-submissionPreferred-package-version - Get the preferred package version for constructing a command submission
     */
    'get'(
      parameters?: Parameters<Paths.GetV2InteractiveSubmissionPreferredPackageVersion.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetV2InteractiveSubmissionPreferredPackageVersion.Responses.$200 | Paths.GetV2InteractiveSubmissionPreferredPackageVersion.Responses.Default>
  }
  ['/v2/interactive-submission/preferred-packages']: {
    /**
     * postV2Interactive-submissionPreferred-packages - Get the version of preferred packages for constructing a command submission
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostV2InteractiveSubmissionPreferredPackages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostV2InteractiveSubmissionPreferredPackages.Responses.$200 | Paths.PostV2InteractiveSubmissionPreferredPackages.Responses.Default>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>


export type AllocatePartyRequest = Components.Schemas.AllocatePartyRequest;
export type AllocatePartyResponse = Components.Schemas.AllocatePartyResponse;
export type ArchivedEvent = Components.Schemas.ArchivedEvent;
export type AssignCommand = Components.Schemas.AssignCommand;
export type AssignCommand1 = Components.Schemas.AssignCommand1;
export type CanActAs = Components.Schemas.CanActAs;
export type CanActAs1 = Components.Schemas.CanActAs1;
export type CanReadAs = Components.Schemas.CanReadAs;
export type CanReadAs1 = Components.Schemas.CanReadAs1;
export type CanReadAsAnyParty = Components.Schemas.CanReadAsAnyParty;
export type CanReadAsAnyParty1 = Components.Schemas.CanReadAsAnyParty1;
export type Command = Components.Schemas.Command;
export type Command1 = Components.Schemas.Command1;
export type Completion = Components.Schemas.Completion;
export type Completion1 = Components.Schemas.Completion1;
export type CompletionResponse = Components.Schemas.CompletionResponse;
export type CompletionStreamRequest = Components.Schemas.CompletionStreamRequest;
export type CompletionStreamResponse = Components.Schemas.CompletionStreamResponse;
export type ConnectedSynchronizer = Components.Schemas.ConnectedSynchronizer;
export type CreateAndExerciseCommand = Components.Schemas.CreateAndExerciseCommand;
export type CreateCommand = Components.Schemas.CreateCommand;
export type CreateIdentityProviderConfigRequest = Components.Schemas.CreateIdentityProviderConfigRequest;
export type CreateIdentityProviderConfigResponse = Components.Schemas.CreateIdentityProviderConfigResponse;
export type CreateUserRequest = Components.Schemas.CreateUserRequest;
export type CreateUserResponse = Components.Schemas.CreateUserResponse;
export type CreatedEvent = Components.Schemas.CreatedEvent;
export type CreatedTreeEvent = Components.Schemas.CreatedTreeEvent;
export type CumulativeFilter = Components.Schemas.CumulativeFilter;
export type DeduplicationDuration = Components.Schemas.DeduplicationDuration;
export type DeduplicationDuration1 = Components.Schemas.DeduplicationDuration1;
export type DeduplicationDuration2 = Components.Schemas.DeduplicationDuration2;
export type DeduplicationOffset = Components.Schemas.DeduplicationOffset;
export type DeduplicationOffset1 = Components.Schemas.DeduplicationOffset1;
export type DeduplicationOffset2 = Components.Schemas.DeduplicationOffset2;
export type DeduplicationPeriod = Components.Schemas.DeduplicationPeriod;
export type DeduplicationPeriod1 = Components.Schemas.DeduplicationPeriod1;
export type DeduplicationPeriod2 = Components.Schemas.DeduplicationPeriod2;
export type DeleteIdentityProviderConfigResponse = Components.Schemas.DeleteIdentityProviderConfigResponse;
export type DisclosedContract = Components.Schemas.DisclosedContract;
export type Duration = Components.Schemas.Duration;
export type Empty = Components.Schemas.Empty;
export type Empty1 = Components.Schemas.Empty1;
export type Empty2 = Components.Schemas.Empty2;
export type Empty3 = Components.Schemas.Empty3;
export type Empty4 = Components.Schemas.Empty4;
export type Empty5 = Components.Schemas.Empty5;
export type Empty6 = Components.Schemas.Empty6;
export type Empty7 = Components.Schemas.Empty7;
export type Empty8 = Components.Schemas.Empty8;
export type Event = Components.Schemas.Event;
export type EventFormat = Components.Schemas.EventFormat;
export type ExecuteSubmissionResponse = Components.Schemas.ExecuteSubmissionResponse;
export type ExerciseByKeyCommand = Components.Schemas.ExerciseByKeyCommand;
export type ExerciseCommand = Components.Schemas.ExerciseCommand;
export type ExercisedEvent = Components.Schemas.ExercisedEvent;
export type ExercisedTreeEvent = Components.Schemas.ExercisedTreeEvent;
export type ExperimentalCommandInspectionService = Components.Schemas.ExperimentalCommandInspectionService;
export type ExperimentalFeatures = Components.Schemas.ExperimentalFeatures;
export type ExperimentalStaticTime = Components.Schemas.ExperimentalStaticTime;
export type FeaturesDescriptor = Components.Schemas.FeaturesDescriptor;
export type Field = Components.Schemas.Field;
export type FieldMask = Components.Schemas.FieldMask;
export type Filters = Components.Schemas.Filters;
export type GetActiveContractsRequest = Components.Schemas.GetActiveContractsRequest;
export type GetConnectedSynchronizersResponse = Components.Schemas.GetConnectedSynchronizersResponse;
export type GetEventsByContractIdRequest = Components.Schemas.GetEventsByContractIdRequest;
export type GetIdentityProviderConfigResponse = Components.Schemas.GetIdentityProviderConfigResponse;
export type GetLatestPrunedOffsetsResponse = Components.Schemas.GetLatestPrunedOffsetsResponse;
export type GetLedgerApiVersionResponse = Components.Schemas.GetLedgerApiVersionResponse;
export type GetLedgerEndResponse = Components.Schemas.GetLedgerEndResponse;
export type GetPackageStatusResponse = Components.Schemas.GetPackageStatusResponse;
export type GetParticipantIdResponse = Components.Schemas.GetParticipantIdResponse;
export type GetPartiesResponse = Components.Schemas.GetPartiesResponse;
export type GetPreferredPackageVersionResponse = Components.Schemas.GetPreferredPackageVersionResponse;
export type GetPreferredPackagesRequest = Components.Schemas.GetPreferredPackagesRequest;
export type GetPreferredPackagesResponse = Components.Schemas.GetPreferredPackagesResponse;
export type GetTransactionByIdRequest = Components.Schemas.GetTransactionByIdRequest;
export type GetTransactionByOffsetRequest = Components.Schemas.GetTransactionByOffsetRequest;
export type GetUpdateByIdRequest = Components.Schemas.GetUpdateByIdRequest;
export type GetUpdateByOffsetRequest = Components.Schemas.GetUpdateByOffsetRequest;
export type GetUpdatesRequest = Components.Schemas.GetUpdatesRequest;
export type GetUserResponse = Components.Schemas.GetUserResponse;
export type GrantUserRightsRequest = Components.Schemas.GrantUserRightsRequest;
export type GrantUserRightsResponse = Components.Schemas.GrantUserRightsResponse;
export type Identifier = Components.Schemas.Identifier;
export type IdentifierFilter = Components.Schemas.IdentifierFilter;
export type IdentityProviderAdmin = Components.Schemas.IdentityProviderAdmin;
export type IdentityProviderAdmin1 = Components.Schemas.IdentityProviderAdmin1;
export type IdentityProviderConfig = Components.Schemas.IdentityProviderConfig;
export type InterfaceFilter = Components.Schemas.InterfaceFilter;
export type InterfaceFilter1 = Components.Schemas.InterfaceFilter1;
export type JsActiveContract = Components.Schemas.JsActiveContract;
export type JsArchived = Components.Schemas.JsArchived;
export type JsAssignedEvent = Components.Schemas.JsAssignedEvent;
export type JsAssignmentEvent = Components.Schemas.JsAssignmentEvent;
export type JsCantonError = Components.Schemas.JsCantonError;
export type JsCommands = Components.Schemas.JsCommands;
export type JsContractEntry = Components.Schemas.JsContractEntry;
export type JsCreated = Components.Schemas.JsCreated;
export type JsEmpty = Components.Schemas.JsEmpty;
export type JsExecuteSubmissionRequest = Components.Schemas.JsExecuteSubmissionRequest;
export type JsGetActiveContractsResponse = Components.Schemas.JsGetActiveContractsResponse;
export type JsGetEventsByContractIdResponse = Components.Schemas.JsGetEventsByContractIdResponse;
export type JsGetTransactionResponse = Components.Schemas.JsGetTransactionResponse;
export type JsGetTransactionTreeResponse = Components.Schemas.JsGetTransactionTreeResponse;
export type JsGetUpdateResponse = Components.Schemas.JsGetUpdateResponse;
export type JsGetUpdateTreesResponse = Components.Schemas.JsGetUpdateTreesResponse;
export type JsGetUpdatesResponse = Components.Schemas.JsGetUpdatesResponse;
export type JsIncompleteAssigned = Components.Schemas.JsIncompleteAssigned;
export type JsIncompleteUnassigned = Components.Schemas.JsIncompleteUnassigned;
export type JsInterfaceView = Components.Schemas.JsInterfaceView;
export type JsPrepareSubmissionRequest = Components.Schemas.JsPrepareSubmissionRequest;
export type JsPrepareSubmissionResponse = Components.Schemas.JsPrepareSubmissionResponse;
export type JsReassignment = Components.Schemas.JsReassignment;
export type JsReassignmentEvent = Components.Schemas.JsReassignmentEvent;
export type JsStatus = Components.Schemas.JsStatus;
export type JsSubmitAndWaitForReassignmentResponse = Components.Schemas.JsSubmitAndWaitForReassignmentResponse;
export type JsSubmitAndWaitForTransactionRequest = Components.Schemas.JsSubmitAndWaitForTransactionRequest;
export type JsSubmitAndWaitForTransactionResponse = Components.Schemas.JsSubmitAndWaitForTransactionResponse;
export type JsSubmitAndWaitForTransactionTreeResponse = Components.Schemas.JsSubmitAndWaitForTransactionTreeResponse;
export type JsTopologyTransaction = Components.Schemas.JsTopologyTransaction;
export type JsTransaction = Components.Schemas.JsTransaction;
export type JsTransactionTree = Components.Schemas.JsTransactionTree;
export type JsUnassignedEvent = Components.Schemas.JsUnassignedEvent;
export type Kind = Components.Schemas.Kind;
export type ListIdentityProviderConfigsResponse = Components.Schemas.ListIdentityProviderConfigsResponse;
export type ListKnownPartiesResponse = Components.Schemas.ListKnownPartiesResponse;
export type ListPackagesResponse = Components.Schemas.ListPackagesResponse;
export type ListUserRightsResponse = Components.Schemas.ListUserRightsResponse;
export type ListUsersResponse = Components.Schemas.ListUsersResponse;
export type Map_Filters = Components.Schemas.MapFilters;
export type Map_Int_Field = Components.Schemas.MapIntField;
export type Map_Int_TreeEvent = Components.Schemas.MapIntTreeEvent;
export type Map_String = Components.Schemas.MapString;
export type MinLedgerTime = Components.Schemas.MinLedgerTime;
export type MinLedgerTimeAbs = Components.Schemas.MinLedgerTimeAbs;
export type MinLedgerTimeRel = Components.Schemas.MinLedgerTimeRel;
export type ObjectMeta = Components.Schemas.ObjectMeta;
export type OffsetCheckpoint = Components.Schemas.OffsetCheckpoint;
export type OffsetCheckpoint1 = Components.Schemas.OffsetCheckpoint1;
export type OffsetCheckpoint2 = Components.Schemas.OffsetCheckpoint2;
export type OffsetCheckpoint3 = Components.Schemas.OffsetCheckpoint3;
export type OffsetCheckpointFeature = Components.Schemas.OffsetCheckpointFeature;
export type PackagePreference = Components.Schemas.PackagePreference;
export type PackageReference = Components.Schemas.PackageReference;
export type PackageVettingRequirement = Components.Schemas.PackageVettingRequirement;
export type ParticipantAdmin = Components.Schemas.ParticipantAdmin;
export type ParticipantAdmin1 = Components.Schemas.ParticipantAdmin1;
export type ParticipantAuthorizationAdded = Components.Schemas.ParticipantAuthorizationAdded;
export type ParticipantAuthorizationAdded1 = Components.Schemas.ParticipantAuthorizationAdded1;
export type ParticipantAuthorizationChanged = Components.Schemas.ParticipantAuthorizationChanged;
export type ParticipantAuthorizationChanged1 = Components.Schemas.ParticipantAuthorizationChanged1;
export type ParticipantAuthorizationRevoked = Components.Schemas.ParticipantAuthorizationRevoked;
export type ParticipantAuthorizationRevoked1 = Components.Schemas.ParticipantAuthorizationRevoked1;
export type ParticipantAuthorizationTopologyFormat = Components.Schemas.ParticipantAuthorizationTopologyFormat;
export type PartyDetails = Components.Schemas.PartyDetails;
export type PartyManagementFeature = Components.Schemas.PartyManagementFeature;
export type PartySignatures = Components.Schemas.PartySignatures;
export type PrefetchContractKey = Components.Schemas.PrefetchContractKey;
export type ProtoAny = Components.Schemas.ProtoAny;
export type Reassignment = Components.Schemas.Reassignment;
export type Reassignment1 = Components.Schemas.Reassignment1;
export type ReassignmentCommand = Components.Schemas.ReassignmentCommand;
export type ReassignmentCommands = Components.Schemas.ReassignmentCommands;
export type RevokeUserRightsRequest = Components.Schemas.RevokeUserRightsRequest;
export type RevokeUserRightsResponse = Components.Schemas.RevokeUserRightsResponse;
export type Right = Components.Schemas.Right;
export type Signature = Components.Schemas.Signature;
export type SinglePartySignatures = Components.Schemas.SinglePartySignatures;
export type SubmitAndWaitForReassignmentRequest = Components.Schemas.SubmitAndWaitForReassignmentRequest;
export type SubmitAndWaitResponse = Components.Schemas.SubmitAndWaitResponse;
export type SubmitReassignmentRequest = Components.Schemas.SubmitReassignmentRequest;
export type SubmitReassignmentResponse = Components.Schemas.SubmitReassignmentResponse;
export type SubmitResponse = Components.Schemas.SubmitResponse;
export type SynchronizerTime = Components.Schemas.SynchronizerTime;
export type TemplateFilter = Components.Schemas.TemplateFilter;
export type TemplateFilter1 = Components.Schemas.TemplateFilter1;
export type Time = Components.Schemas.Time;
export type TopologyEvent = Components.Schemas.TopologyEvent;
export type TopologyEventEvent = Components.Schemas.TopologyEventEvent;
export type TopologyFormat = Components.Schemas.TopologyFormat;
export type TopologyTransaction = Components.Schemas.TopologyTransaction;
export type TraceContext = Components.Schemas.TraceContext;
export type Transaction = Components.Schemas.Transaction;
export type TransactionFilter = Components.Schemas.TransactionFilter;
export type TransactionFormat = Components.Schemas.TransactionFormat;
export type TransactionTree = Components.Schemas.TransactionTree;
export type TreeEvent = Components.Schemas.TreeEvent;
export type Tuple2_String_String = Components.Schemas.Tuple2StringString;
export type UnassignCommand = Components.Schemas.UnassignCommand;
export type UnassignCommand1 = Components.Schemas.UnassignCommand1;
export type UnassignedEvent = Components.Schemas.UnassignedEvent;
export type UnknownFieldSet = Components.Schemas.UnknownFieldSet;
export type Update = Components.Schemas.Update;
export type Update1 = Components.Schemas.Update1;
export type UpdateFormat = Components.Schemas.UpdateFormat;
export type UpdateIdentityProviderConfigRequest = Components.Schemas.UpdateIdentityProviderConfigRequest;
export type UpdateIdentityProviderConfigResponse = Components.Schemas.UpdateIdentityProviderConfigResponse;
export type UpdatePartyDetailsRequest = Components.Schemas.UpdatePartyDetailsRequest;
export type UpdatePartyDetailsResponse = Components.Schemas.UpdatePartyDetailsResponse;
export type UpdateUserIdentityProviderIdRequest = Components.Schemas.UpdateUserIdentityProviderIdRequest;
export type UpdateUserIdentityProviderIdResponse = Components.Schemas.UpdateUserIdentityProviderIdResponse;
export type UpdateUserRequest = Components.Schemas.UpdateUserRequest;
export type UpdateUserResponse = Components.Schemas.UpdateUserResponse;
export type UploadDarFileResponse = Components.Schemas.UploadDarFileResponse;
export type User = Components.Schemas.User;
export type UserManagementFeature = Components.Schemas.UserManagementFeature;
export type WildcardFilter = Components.Schemas.WildcardFilter;
export type WildcardFilter1 = Components.Schemas.WildcardFilter1;
