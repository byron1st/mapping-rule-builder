<script lang="ts">
	import type { DependencyRelation } from '$lib/model';
	import Plus from '$lib/icons/Plus.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import MappingRuleForm from '$lib/components/MappingRuleForm.svelte';
	import SchemaElement from '$lib/components/SchemaElement.svelte';
	import MappingRuleFormInput from '$lib/components/MappingRuleFormInput.svelte';
	import DrBottomModal from '$lib/components/DRBottomModal.svelte';
	import DrItem from '$lib/components/DRItem.svelte';
	import { project } from '$lib/store';

	let relation: DependencyRelation | undefined = undefined;
	let showProcedureModal = false;

	function selectRelation(r: DependencyRelation) {
		relation = r;
		showProcedureModal = false;
	}

	let connectorType: string = '';

	let newSourceSchemaElement: string = '';
	let sourceSchema: string[] = [];

	function addSourceSchemaElement(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			if (!sourceSchema.includes(newSourceSchemaElement)) {
				sourceSchema = [...sourceSchema, newSourceSchemaElement];
			}

			newSourceSchemaElement = '';
		}
	}

	function removeSourceSchemaElement(index: number) {
		sourceSchema.splice(index, 1);
		sourceSchema = [...sourceSchema];
	}

	let newTargetSchemaElement: string = '';
	let targetSchema: string[] = [];

	function addTargetSchemaElement(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			if (!targetSchema.includes(newTargetSchemaElement)) {
				targetSchema = [...targetSchema, newTargetSchemaElement];
			}

			newTargetSchemaElement = '';
		}
	}

	function removeTargetSchemaElement(index: number) {
		targetSchema.splice(index, 1);
		targetSchema = [...targetSchema];
	}
</script>

<Toolbar>
	<div class="flex w-full flex-row">
		<IconButton onClick={() => {}} icon={Plus} />
	</div>
</Toolbar>

{#if $project}
	<div class="flex flex-col gap-6 p-2">
		<MappingRuleForm id="procedure-input" label="Procedure">
			<MappingRuleFormInput
				id="procedure-input"
				value={relation?.source ?? ''}
				placeholder="Select a procedure"
				onClick={() => (showProcedureModal = true)}
				disabled={showProcedureModal}
			/>
			{#if relation}
				<DrItem {relation} />
			{/if}
		</MappingRuleForm>

		<MappingRuleForm id="connector-type" label="Connector Type">
			<MappingRuleFormInput
				id="connector-type"
				bind:value={connectorType}
				placeholder="Type a connector type"
			/>
		</MappingRuleForm>

		<MappingRuleForm id="source-comp" label="Source Component Identifier Schema">
			<MappingRuleFormInput
				id="source-comp"
				bind:value={newSourceSchemaElement}
				placeholder="Type a new element for the schema"
				onKeyDown={addSourceSchemaElement}
			/>

			<div class="flex flex-row flex-wrap">
				{#each sourceSchema as element, index}
					<SchemaElement {element} remove={() => removeSourceSchemaElement(index)} />
				{/each}
			</div>
		</MappingRuleForm>

		<MappingRuleForm id="target-comp" label="Target Component Identifier Schema">
			<MappingRuleFormInput
				id="target-comp"
				bind:value={newTargetSchemaElement}
				placeholder="Type a new element for the schema"
				onKeyDown={addTargetSchemaElement}
			/>

			<div class="flex flex-row flex-wrap">
				{#each targetSchema as element, index}
					<SchemaElement {element} remove={() => removeTargetSchemaElement(index)} />
				{/each}
			</div>
		</MappingRuleForm>
	</div>

	<DrBottomModal bind:show={showProcedureModal} onSelect={selectRelation} />
{/if}
