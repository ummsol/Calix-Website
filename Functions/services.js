$(function () {
    "use strict";

    const modalHtml = `
        <div class="modal fade service-quote-modal" id="serviceQuoteModal" tabindex="-1" aria-labelledby="serviceQuoteModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <div><p class="small text-secondary mb-1">Add service to quote</p><h2 class="modal-title fs-4" id="serviceQuoteModalLabel"></h2></div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="serviceQuoteForm">
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-md-6"><label class="form-label" for="servicePropertyType">Property type</label><select class="form-select" id="servicePropertyType" required><option value="Residential house">Residential house</option><option value="Condominium">Condominium</option><option value="Commercial building">Commercial building</option><option value="Office / storefront">Office / storefront</option><option value="Other">Other</option></select></div>
                                <div class="col-md-6"><label class="form-label" for="serviceSchedule">Preferred site visit</label><input class="form-control" id="serviceSchedule" type="date"></div>
                                <div class="col-md-6"><label class="form-label" for="serviceArea">Estimated work area</label><input class="form-control" id="serviceArea" placeholder="e.g. 12 sqm, 3 windows, 1 storefront" type="text"></div>
                                <div class="col-md-6"><label class="form-label" for="serviceLocation">Project location</label><input class="form-control" id="serviceLocation" placeholder="City / project site" type="text"></div>
                                <div class="col-12"><label class="form-label" for="serviceNotes">Service requirements</label><textarea class="form-control" id="serviceNotes" rows="3" placeholder="Describe what needs to be installed, fabricated, managed, repaired, or measured"></textarea></div>
                            </div>
                        </div>
                        <div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button type="submit" class="btn btn-calix-action">Add to quote</button></div>
                    </form>
                </div>
            </div>
        </div>`;
    $("body").append(modalHtml);

    let selectedService = "";
    $(".service-quote-button").on("click", function (event) {
        event.preventDefault();
        selectedService = $(this).closest(".service-plan-card").find("h3").text().trim();
        $("#serviceQuoteModalLabel").text(selectedService);
        bootstrap.Modal.getOrCreateInstance(document.getElementById("serviceQuoteModal")).show();
    });

    $("#serviceQuoteForm").on("submit", function (event) {
        event.preventDefault();
        CalixApp.addQuoteItem({
            type: "Service",
            name: selectedService,
            category: "CALIX Service",
            quantity: 1,
            specs: {
                propertyType: $("#servicePropertyType").val(),
                preferredVisit: $("#serviceSchedule").val(),
                estimatedArea: $("#serviceArea").val().trim(),
                projectLocation: $("#serviceLocation").val().trim(),
                notes: $("#serviceNotes").val().trim()
            }
        });
        bootstrap.Modal.getInstance(document.getElementById("serviceQuoteModal")).hide();
        this.reset();
        CalixApp.showToast(`${selectedService} added to your quote list.`);
    });
});
