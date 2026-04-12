<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';
	import { employeeSchema } from '../schemas/employee.schema';
	import { GlassPanel, FormField } from '$lib/components/ui';
	import { FormActions } from '$lib/components/ui/forms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { EmployeeFormData } from '../schemas/employee.schema';

	let {
		data,
		editId = '',
		action = '?/create',
		submitLabel = 'Add Employee',
		oncancel
	}: {
		data: SuperValidated<EmployeeFormData>;
		editId?: string;
		action?: string;
		submitLabel?: string;
		oncancel?: () => void;
	} = $props();

	const { form, errors, enhance, delayed } = superForm(data, {
		validators: zodClient(employeeSchema),
		resetForm: true,
		onUpdated({ form: f }) {
			if (f.valid && oncancel) oncancel();
		}
	});
</script>

<GlassPanel>
	<h2 class="text-lg font-semibold mb-4">{submitLabel === 'Add Employee' ? 'Add Employee' : 'Edit Employee'}</h2>

	<form method="POST" {action} use:enhance>
		{#if editId}
			<input type="hidden" name="id" value={editId} />
		{/if}
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
			<FormField
				name="name"
				label="Name"
				placeholder="John Doe"
				required
				bind:value={$form.name}
				error={$errors.name?.[0] ?? ''}
			/>
			<FormField
				name="email"
				label="Email"
				type="email"
				placeholder="john@example.com"
				required
				bind:value={$form.email}
				error={$errors.email?.[0] ?? ''}
			/>
			<FormField
				name="role"
				label="Role"
				placeholder="Developer"
				required
				bind:value={$form.role}
				error={$errors.role?.[0] ?? ''}
			/>
		</div>

		<FormActions {submitLabel} delayed={$delayed} {oncancel} />
	</form>
</GlassPanel>
