<script>
	export async function GetAllInscriptions() {
		let insArray = [];
        let limit = 10

		const inscriptions = 'https://api.hiro.so/ordinals/v1/inscriptions?limit=' + limit;
		const insResponse = await fetch(inscriptions);
		const all = await insResponse.json();
		const allresults = await all;
		//console.log('Total: ' + all.total);
		const allIDs = allresults.results[0]
		console.log(allIDs)

		for (let i = 0; i < limit; i++) {
            //const inscriptions = allresults.results[i]
            //console.log(inscriptions)
            //////////////////////////////// id
			const id = allresults.results[i].id
			//console.log(id)
            //////////////////////////////// genesis_block_height
			const genesis_block_height = allresults.results[i].genesis_block_height
			// console.log(genesis_block_height)
            ///////////////////////////////// content_type
			const content_type = allresults.results[i].content_type
			// console.log(content_type)
            //////////////////////////////// timestamp
			const timestamp = allresults.results[i].timestamp
			// console.log(timestamp)
            //////////////////////////////// address
			const address = allresults.results[i].address
			// console.log(address)
			//////////////////////////////// address
			const mime_type = allresults.results[i].mime_type
			// console.log(mime_type)

			///////////////////////////////// content
            const inscriptionid = 'https://api.hiro.so/ordinals/v1/inscriptions/' + id;
			const content = await fetch(inscriptionid + '/content');
			const ins = await content.text();
            // console.log(ins)

            insArray.push({id, genesis_block_height, timestamp, ins, mime_type})
		}

		console.log(insArray);
		return insArray;
	}

	function handleSubmit() {
		console.log('submit');
	}
</script>

<button on:click={GetAllInscriptions}> See all Bitmaps </button>